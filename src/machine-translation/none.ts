import { TranslateFunc } from './types'

const translate: TranslateFunc = async (
  _targetLanguage,
  sourceText,
  _sourceLanguage,
) => {
  return Promise.resolve().then(() => {
    return sourceText
  })
}

export { translate }
