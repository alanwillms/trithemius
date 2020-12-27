import firebase from '@/firebase'
import chunk from 'lodash.chunk'
import { TranslationProject, TranslationProjectParagraph } from '@/types'
import { userStore } from '@/store/user.store'
import {
  FindTranslationFunc,
  ListTranslationsFunc,
  StoreTranslationFunc,
} from './types'

const db = firebase.firestore()

const getDocumentReference = (id: string) => {
  return db.collection('projects').doc(id)
}

const findTranslation: FindTranslationFunc = async id => {
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

const listTranslations: ListTranslationsFunc = async conditions => {
  const { order } = conditions || {}
  const { data } = userStore.getState()
  let query = db
    .collection('projects')
    .where('owner', '==', data?.uid)
    .where('deletedAt', '==', null)
  if (order) {
    query = query.orderBy(order.by, order.direction)
  }
  const records = await query.get()
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
        owner: firebase.auth().currentUser?.uid,
      }
      batch.set(collection.doc(`${paragraph.key}`), data)
    }

    await batch.commit()
  }
}

const storeTranslation: StoreTranslationFunc = async project => {
  const docRef = getDocumentReference(project.id)
  const record = await docRef.get()
  const data = {
    owner: firebase.auth().currentUser?.uid,
    id: project.id,
    title: project.title,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt || project.createdAt,
    deletedAt: project.deletedAt || null,
    sourceLanguage: project.sourceLanguage,
    targetLanguage: project.targetLanguage,
    completeness: project.completeness,
    wordCount: project.wordCount,
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
