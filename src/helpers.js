
import { v4 as uuid } from 'uuid'

export function editTranslation ({ id }) {
  // @fixme
  // this.$router.push({ name: 'edit_translation', params: { id } })
  window.location.href = `/translations/${id}`
}

export function deleteTranslation ({ id }) {
  const translations = getTranslations().filter(found => found.id !== id)
  window.localStorage.setItem('translations', JSON.stringify(translations))
  window.localStorage.removeItem(`translation-${id}`)
}

export function createTranslation (metadata, paragraphs) {
  const { title, sourceLanguage, targetLanguage } = metadata
  const translation = {
    id: uuid(),
    title,
    createdAt: (new Date()).toISOString(),
    sourceLanguage,
    targetLanguage
  }
  const translations = getTranslations()
  translations.push(translation)
  window.localStorage.setItem('translations', JSON.stringify(translations))
  window.localStorage.setItem(`translation-${translation.id}`, JSON.stringify(paragraphs))

  return translation
}

export function updateTranslation (translation) {
  const { id, paragraphs } = translation
  window.localStorage.setItem(`translation-${id}`, JSON.stringify(paragraphs))
}

export function getTranslation (id) {
  const translation = getTranslations().find(found => found.id === id)
  if (translation) {
    translation.paragraphs = JSON.parse(window.localStorage.getItem(`translation-${translation.id}`) || '[]')
    return translation
  }
}

export function getTranslations () {
  return JSON.parse(window.localStorage.getItem('translations') || '[]')
}
