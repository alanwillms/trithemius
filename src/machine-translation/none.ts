import { TranslateFunc } from './types'

const translate: TranslateFunc = async (
  targetLanguage,
  sourceText,
  sourceLanguage,
) => {
  return Promise.resolve().then(() => {
    return sourceText
  })
}

export { translate }
