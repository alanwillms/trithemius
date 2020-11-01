import { LanguageCode } from '@/types'

export interface TranslateFunc {
  (
    targetLanguage: LanguageCode,
    sourceText: string,
    sourceLanguage: LanguageCode,
  ): Promise<string>
}

export interface TranslationDriver {
  translate: TranslateFunc
}

export interface TranslationDriverMap {
  [key: string]: TranslationDriver
}
