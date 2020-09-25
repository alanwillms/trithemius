import firebase from '../firebase'
import chunk from 'lodash.chunk'

const db = firebase.firestore()

enum LanguageCode {}

interface TranslationProject {
  owner: string
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  sourceLanguage: LanguageCode
  targetLanguage: LanguageCode
  completeness: number
  paragraphs?: TranslationProjectParagraph[]
}

interface TranslationProjectParagraph {
  key: number
  source: string
  automaticTranslation?: string
  translation: string
  touched: boolean
}

const getDocumentReference = (id: string) => {
  return db.collection('projects').doc(id)
}

const findTranslation = async (id: string) => {
  const docRef = getDocumentReference(id)
  const record = await docRef.get()
  const translationProject = record.data() as TranslationProject | undefined

  if (translationProject) {
    const humanTranslation = await docRef
      .collection('paragraphs')
      .orderBy('key')
      .get()

    if (humanTranslation.size > 0) {
      const data =
        (humanTranslation.docs.map(item => item.data()) as
          | TranslationProjectParagraph[]
          | undefined) || []
      translationProject.paragraphs = data
    }
  }

  return translationProject
}

const listTranslations = async (id: string) => {
  const records = await db.collection('projects').get()
  return records.docs.map(doc => doc.data() as TranslationProject)
}

const storeTranslationParagraphs = async (project: TranslationProject) => {
  const collection = getDocumentReference(project.id).collection('paragraphs')
  const chunks = chunk(project.paragraphs || [], 500)

  for (const paragraphs of chunks) {
    const batch = db.batch()

    for (const paragraph of paragraphs) {
      const data = {
        key: parseInt(`${paragraph.key}`, 10),
        source: paragraph.source,
        translation: paragraph.translation,
        automaticTranslation: paragraph.automaticTranslation,
        touched: paragraph.touched,
      }
      batch.set(collection.doc(`${paragraph.key}`), data)
    }

    await batch.commit()
  }
}

const storeTranslation = async (project: TranslationProject) => {
  const docRef = getDocumentReference(project.id)
  const record = await docRef.get()
  const data = {
    owner: project.owner,
    id: project.id,
    title: project.title,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt || project.createdAt,
    deletedAt: project.deletedAt || null,
    sourceLanguage: project.sourceLanguage,
    targetLanguage: project.targetLanguage,
    completeness: project.completeness,
  }
  if (record.exists) {
    await docRef.update(data)
    if (project.paragraphs && project.paragraphs.length > 0) {
      await storeTranslationParagraphs(project)
    }
    return project
  }

  await docRef.set(data)
  if (project.paragraphs && project.paragraphs.length > 0) {
    await storeTranslationParagraphs(project)
  }
  return project
}

export { storeTranslation, findTranslation, listTranslations }
