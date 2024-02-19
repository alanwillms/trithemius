import { StorageDriverMap } from './types'

import * as firebase from './firebase'
import * as localstorage from './localstorage'

const drivers: StorageDriverMap = { firebase, localstorage }
const chosenDriver = import.meta.env.VITE_STORAGE_DRIVER || 'localstorage'
const driver = drivers[chosenDriver]

if (!driver) {
  throw new Error(`Invalid storage driver "${chosenDriver}"`)
}

const storeTranslation = driver.storeTranslation

const findTranslation = driver.findTranslation

const listTranslations = driver.listTranslations

export { storeTranslation, findTranslation, listTranslations }
