import firebase from '@/firebase'
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy,
  writeBatch,
  DocumentData,
} from 'firebase/firestore'
import chunk from 'lodash.chunk'
import { TranslationProject, TranslationProjectParagraph } from '@/types'
import { userStore } from '@/store/user.store'
import {
  FindTranslationFunc,
  ListTranslationsFunc,
  StoreTranslationFunc,
} from './types'

const db = getFirestore(firebase)

const getDocumentReference = (id: string) => {
  return doc(db, 'projects', id)
}

const findTranslation: FindTranslationFunc = async (id) => {
  const docRef = getDocumentReference(id)
  const record = await getDoc(docRef)
  const translationProject = record.data() as TranslationProject | undefined

  if (translationProject) {
    const paragraphsCollection = collection(docRef, 'paragraphs')
    const humanTranslation = await getDocs(query(paragraphsCollection))

    if (humanTranslation.size > 0) {
      const data =
        (humanTranslation.docs.map((item: DocumentData) => item.data()) as
          | TranslationProjectParagraph[]
          | undefined) || []
      translationProject.paragraphs = data
      translationProject.paragraphs.forEach((paragraph) => {
        paragraph.synchronized = true
      })
    }
  }

  return translationProject
}

const listTranslations: ListTranslationsFunc = async (conditions) => {
  const { order } = conditions || {}
  const { data } = userStore.getState()
  const projectsCollection = collection(db, 'projects')
  let q = query(
    projectsCollection,
    where('owner', '==', data?.uid),
    where('deletedAt', '==', null),
  )
  if (order) {
    q = query(q, orderBy(order.by, order.direction))
  }
  const records = await getDocs(q)
  return records.docs.map(
    (doc: DocumentData) => doc.data() as TranslationProject,
  )
}

const storeTranslationParagraphs = async (project: TranslationProject) => {
  const paragraphsCollection = collection(
    doc(db, 'projects', project.id),
    'paragraphs',
  )
  const chunks = chunk(project.paragraphs || [], 500)

  for (const paragraphs of chunks) {
    const batch = writeBatch(db)

    for (const paragraph of paragraphs) {
      if (!paragraph.synchronized) {
        const data = {
          key: parseInt(`${paragraph.key}`, 10),
          source: paragraph.source,
          translation: paragraph.translation,
          automaticTranslation: paragraph.automaticTranslation,
          touched: paragraph.touched,
          owner: userStore.getState().data?.uid,
        }
        console.log(`Synchronizing paragraph ${paragraph.key}`, data)
        const paragraphDoc = doc(paragraphsCollection, `${paragraph.key}`)
        batch.set(paragraphDoc, data)
        paragraph.synchronized = true
      }
    }

    await batch.commit()
  }
}

const storeTranslation: StoreTranslationFunc = async (project) => {
  const docRef = getDocumentReference(project.id)
  const record = await getDoc(docRef)
  const data = {
    owner: userStore.getState().data?.uid,
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
  if (record.exists()) {
    await updateDoc(docRef, data)
    if (project.paragraphs && project.paragraphs.length > 0) {
      await storeTranslationParagraphs(project)
    }
    return project
  }

  await setDoc(docRef, data)
  if (project.paragraphs && project.paragraphs.length > 0) {
    await storeTranslationParagraphs(project)
  }
  return project
}

export { storeTranslation, findTranslation, listTranslations }
