import { Store } from '@/store/store'
import { TranslationProject } from '@/types'

export interface ListTranslationsFunc {
  (): Promise<TranslationProject[]>
}

export interface StoreTranslationFunc {
  (project: TranslationProject): Promise<TranslationProject>
}

export interface FindTranslationFunc {
  (id: string): Promise<TranslationProject | undefined>
}

export interface StorageDriver {
  storeTranslation: StoreTranslationFunc
  findTranslation: FindTranslationFunc
  listTranslations: ListTranslationsFunc
}

export interface StorageDriverMap {
  [key: string]: StorageDriver
}
