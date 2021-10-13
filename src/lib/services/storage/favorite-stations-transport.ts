import { Transport } from '@fuerte/core'
import { RadioModel } from 'lib/radio-model'
import { AppStorageService } from './app-storage-service'

export class FavoriteStationsTransport implements Transport<RadioModel> {
  constructor(protected storage: AppStorageService) {}

  async load(): Promise<{ data: any[] }> {
    const data = await this.storage.getFavoriteStations()

    return { data }
  }

  save(radio: RadioModel) {
    return this.storage.addFavoriteStation(radio.data)
  }

  delete(radio: RadioModel) {
    return this.storage.removeFavoriteStation(radio.id)
  }
}
