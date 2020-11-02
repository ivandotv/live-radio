import { RadioStation } from 'types'
import { defaultStation } from 'lib/utils'
// todo make interface

export interface AppStorage {
  getLastUsedStation: () => RadioStation
}

export const LocalStorageSSR = {
  getLastUsedStation(_fromCache = false) {
    return defaultStation
  }
}

export class LocalStorage {
  lastUsedStation: RadioStation | undefined

  constructor(protected localStorage: Storage) {}

  getLastUsedStation(fromCache = false): RadioStation {
    if (fromCache && this.lastUsedStation) return this.lastUsedStation

    const lastUsedStation = this.localStorage.getItem('lastUsedStation')
    if (lastUsedStation) {
      return JSON.parse(lastUsedStation)
    } else {
      return defaultStation
    }
  }
}
