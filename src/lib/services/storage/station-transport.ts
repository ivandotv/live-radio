import { Transport } from '@fuerte/core'
import { RadioModel } from 'lib/radio-model'
import { RadioDTO } from 'lib/utils/station-utils'
import {
  AppStorageService,
  StorageCollection,
  StorageType
} from './app-storage-service'

export class StationTransport implements Transport<RadioModel> {
  constructor(
    protected storage: AppStorageService,
    protected collection: StorageCollection
  ) {}

  async load(type?: StorageType) {
    const data = await this.storage.getAllStations(this.collection, type)

    return { data }
  }

  save(radio: RadioModel) {
    return this.storage.saveStation(radio.data, this.collection)
  }

  delete(radio: RadioModel) {
    return this.storage.removeStation(radio.id, this.collection)
  }

  async getStationInfo(id: string): Promise<RadioDTO> {
    return this.storage.getStationInfo(id)
  }
}
