import { TranslationDriverMap } from './types'

import * as google from './google'
import * as none from './none'

const drivers: TranslationDriverMap = { google, none }
const chosenDriver = import.meta.env.VITE_TRANSLATION_DRIVER || 'none'
const driver = drivers[chosenDriver]

if (!driver) {
  throw new Error(`Invalid translation driver "${chosenDriver}"`)
}

const translate = driver.translate

export { translate }
