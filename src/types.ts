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
  wordCount?: number
}

interface TranslationProjectParagraph {
  key: number
  source: string
  automaticTranslation?: string
  translation: string
  touched: boolean
  synchronized: boolean
}

export type { LanguageCode, TranslationProject, TranslationProjectParagraph }
