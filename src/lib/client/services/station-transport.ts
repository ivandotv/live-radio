import { Transport } from '@fuerte/core'
import { RadioModel } from 'lib/client/radio-model'
import { RadioDTO } from 'lib/shared/utils'
import { get } from 'pumpit'
import {
  AppStorageService,
  StorageCollection,
  StorageType
} from './storage/app-storage-service'

export class StationTransport implements Transport<RadioModel> {
  protected collection?: StorageCollection

  static inject = [get(AppStorageService, { lazy: true })]

  constructor(protected storage: AppStorageService) {}

  setCollection(collection: StorageCollection) {
    this.collection = collection
  }

  protected getCollection() {
    if (!this.collection) {
      throw new Error('collection not set')
    }

    return this.collection
  }

  async load(type?: StorageType) {
    const data = await this.storage.getAllStations(this.getCollection(), type)

    return { data }
  }

  save(radio: RadioModel) {
    return this.storage.saveStation(radio.data, this.getCollection())
  }

  delete(radio: RadioModel) {
    return this.storage.removeStation(radio.id, this.getCollection())
  }

  async getStationInfo(id: string): Promise<RadioDTO> {
    return this.storage.getStationInfo(id)
  }
}
