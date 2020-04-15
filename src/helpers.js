
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
    targetLanguage,
    completeness: 0
  }
  const translations = getTranslations()
  translations.push(translation)
  window.localStorage.setItem('translations', JSON.stringify(translations))
  window.localStorage.setItem(`translation-${translation.id}`, JSON.stringify(paragraphs))

  return translation
}

export function updateTranslation (translation) {
  const { id, completeness, paragraphs } = translation
  const translations = getTranslations()
  for (const found of translations) {
    if (found.id === id) {
      found.completeness = completeness
    }
  }
  window.localStorage.setItem('translations', JSON.stringify(translations))
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

export function calculateCompletenessPercentage (paragraphs) {
  const sum = (total, num) => {
    return total + num
  }
  const total = paragraphs.map(found => found.translation.length).reduce(sum, 0)
  const translated = paragraphs.filter(found => found.touched).map(found => found.translation.length).reduce(sum, 0)
  if (total === 0) {
    return 100
  }
  const percentage = (translated / total * 100)

  if (percentage > 100) {
    return 100
  }

  return percentage
}
