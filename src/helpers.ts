import { v4 as uuid } from 'uuid'

interface ObjectWithId {
  id?: string
}

export function editTranslation({ id }: ObjectWithId) {
  // @fixme
  // this.$router.push({ name: 'edit_translation', params: { id } })
  window.location.href = `/translations/${id}`
}

export function deleteTranslation({ id }: ObjectWithId) {
  const translations = getTranslations().filter(
    (found: ObjectWithId) => found.id !== id,
  )
  window.localStorage.setItem('translations', JSON.stringify(translations))
  window.localStorage.removeItem(`translation-${id}`)
}

export function createTranslation(metadata: any, paragraphs: any[]) {
  const { title, sourceLanguage, targetLanguage } = metadata
  const translation = {
    id: uuid(),
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sourceLanguage,
    targetLanguage,
    completeness: 0,
  }
  const translations = getTranslations()
  translations.push(translation)
  window.localStorage.setItem('translations', JSON.stringify(translations))
  window.localStorage.setItem(
    `translation-${translation.id}`,
    JSON.stringify(paragraphs),
  )

  return translation
}

export function updateTranslation(translation: any) {
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

export function getTranslation(id: string) {
  const translation = getTranslations().find(
    (found: ObjectWithId) => found.id === id,
  )
  if (translation) {
    translation.paragraphs = JSON.parse(
      window.localStorage.getItem(`translation-${translation.id}`) || '[]',
    )
    return translation
  }
}

export function getTranslations() {
  return JSON.parse(window.localStorage.getItem('translations') || '[]')
}

export function calculateCompletenessPercentage(paragraphs: any[]) {
  const sum = (total: number, num: number) => {
    return total + num
  }
  const total = paragraphs.map(found => found.translation.length).reduce(sum, 0)
  const translated = paragraphs
    .filter(found => found.touched)
    .map(found => found.translation.length)
    .reduce(sum, 0)
  if (total === 0) {
    return 100
  }
  const percentage = (translated / total) * 100

  if (percentage > 100) {
    return 100
  }

  return percentage
}

export function getSettings() {
  return JSON.parse(window.localStorage.getItem('settings') || '{}')
}

export function getSetting(key: string) {
  const settings = getSettings()
  return settings[key]
}

export function defineSetting(key: string, value: any) {
  const settings = getSettings()
  settings[key] = value
  window.localStorage.setItem('settings', JSON.stringify(settings))
}
