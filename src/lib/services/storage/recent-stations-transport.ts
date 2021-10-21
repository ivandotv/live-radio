import { Transport } from '@fuerte/core'
import { RadioModel } from 'lib/radio-model'
import { RadioDTO } from 'lib/station-utils'
import { AppStorageService, STORAGE_TYPE } from './app-storage-service'

export class RecentStationsTransport implements Transport<RadioModel> {
  constructor(protected storage: AppStorageService) {}

  async load(type?: STORAGE_TYPE): Promise<{ data: any[] }> {
    const data = await this.storage.getRecentStations(type)

    return { data }
  }

  async save(radio: RadioModel): Promise<void> {
    await this.storage.addRecentStation(radio.data)
  }

  async delete(radio: RadioModel): Promise<void> {
    return await this.storage.removeRecentStation(radio.id)
  }

  async getStationInfo(id: string): Promise<RadioDTO> {
    return this.storage.getStationInfo(id)
  }
}
