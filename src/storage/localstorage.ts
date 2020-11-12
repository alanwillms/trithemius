import { TranslationProject } from '@/types'
import {
  FindTranslationFunc,
  ListTranslationsFunc,
  StoreTranslationFunc,
} from './types'

const projectsKey =
  process.env.VUE_APP_LOCALSTORAGE_PROJECTS_KEY || 'translations'
const paragraphsKeyPrefix =
  process.env.VUE_APP_LOCALSTORAGE_PARAGRAPHS_KEY_PREFIX || 'translation-'

function getTranslations() {
  return JSON.parse(window.localStorage.getItem(projectsKey) || '[]')
}

const listTranslations: ListTranslationsFunc = conditions => {
  const { order } = conditions || {}
  return Promise.resolve().then(function() {
    let translations = getTranslations()
    if (order) {
      translations = translations.sort((a: any, b: any) => {
        if (a[order.by] < b[order.by]) {
          return order.direction === 'desc' ? 1 : -1
        }
        if (a[order.by] > b[order.by]) {
          return order.direction === 'desc' ? -1 : 1
        }

        return 0
      })
    }
    return translations
  })
}

const findTranslation: FindTranslationFunc = id => {
  console.log('finding', `${paragraphsKeyPrefix}${id}`)
  return Promise.resolve().then(function() {
    const translation = getTranslations().find(
      (found: TranslationProject) => found.id === id,
    )
    console.log({ lista: getTranslations() })
    if (translation) {
      console.log(translation)
      translation.paragraphs = JSON.parse(
        window.localStorage.getItem(
          `${paragraphsKeyPrefix}${translation.id}`,
        ) || '[]',
      )
      return translation
    }
  })
}

const storeTranslation: StoreTranslationFunc = project => {
  return Promise.resolve().then(function() {
    const translations = getTranslations()
    const index = translations.findIndex(
      (found: TranslationProject) => found.id === project.id,
    )
    const cloned = JSON.parse(JSON.stringify(project))
    delete cloned.paragraphs
    if (index >= 0) {
      translations[index] = cloned
    } else {
      translations.push(cloned)
    }
    window.localStorage.setItem(projectsKey, JSON.stringify(translations))
    window.localStorage.setItem(
      `${paragraphsKeyPrefix}${project.id}`,
      JSON.stringify(project.paragraphs),
    )
    return project
  })
}

export { findTranslation, listTranslations, storeTranslation }
