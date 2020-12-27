import chunk from 'lodash.chunk'
import { TranslateFunc } from './types'

const API_KEY = process.env.VUE_APP_GOOGLE_TRANSLATE_API_KEY
const MAX_PARAGRAPHS_PER_REQUEST = 128
const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`

const sleep = (millis: number) => {
  return new Promise(resolve => setTimeout(resolve, millis))
}

const translate: TranslateFunc = async (
  targetLanguage,
  sourceText,
  sourceLanguage,
) => {
  const sourceParagraphs = sourceText.split('\n\n')
  const chunks = chunk(sourceParagraphs, MAX_PARAGRAPHS_PER_REQUEST)
  let automaticTranslationParagraphs: string[] = []

  for (const key in chunks) {
    const chunk = chunks[key]
    const data = {
      q: chunk,
      source: sourceLanguage,
      target: targetLanguage,
    }
    if (parseInt(key, 10) > 0) {
      await sleep(60000)
    }
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    const jsonData = await response.json()

    const responseTranslations = jsonData.data.translations.map(
      (item: any) => item.translatedText,
    )

    automaticTranslationParagraphs = [
      ...automaticTranslationParagraphs,
      ...responseTranslations,
    ]
  }

  return automaticTranslationParagraphs
    .join('\n\n')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export { translate }
