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

export { LanguageCode, TranslationProject, TranslationProjectParagraph }