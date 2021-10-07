import { Transport } from '@fuerte/core'
import { RadioModel } from 'lib/radio-model'
import { AppStorageService } from './app-storage-service'

export class FavoriteStationsTransport implements Transport<RadioModel> {
  constructor(protected storage: AppStorageService) {}

  async load(): Promise<{ data: any[] }> {
    const data = await this.storage.getFavoriteStations()

    return { data }
  }

  async save(radio: RadioModel): Promise<void> {
    await this.storage.addFavoriteStation(radio.data)
  }

  async delete(radio: RadioModel): Promise<void> {
    await this.storage.removeFavoriteStation(radio.id)
  }
}
