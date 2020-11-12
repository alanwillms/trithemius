import { TranslationProject } from '@/types'

interface SortOrder {
  by: string
  direction?: 'asc' | 'desc'
}

interface ListOptions {
  order?: SortOrder
}

export interface ListTranslationsFunc {
  (options?: ListOptions): Promise<TranslationProject[]>
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
