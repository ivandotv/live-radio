import { Transport } from '@fuerte/core'
import { RadioModel } from 'lib/client/radio-model'
import { RadioDTO } from 'lib/shared/utils'
import { get } from 'pumpit'
import {
  StorageService,
  StorageCollectionName,
  StorageType
} from 'lib/client/services/storage/storage-service'

export class StationTransport implements Transport<RadioModel> {
  protected collection?: StorageCollectionName

  static inject = [get(StorageService, { lazy: true })]

  constructor(
    protected storage: StorageService,
    protected collectionName: StorageCollectionName
  ) {}

  async load(config: {
    type?: StorageType
    collection: StorageCollectionName
  }) {
    const data = await this.storage.getAllStations(
      config.collection,
      config.type
    )

    return { data }
  }

  save(radio: RadioModel, config: { collection: StorageCollectionName }) {
    return this.storage.saveStation(radio.id, config.collection)
  }

  delete(radio: RadioModel, config: { collection: StorageCollectionName }) {
    return this.storage.removeStation(radio.id, config.collection)
  }

  async getStationInfo(id: string): Promise<RadioDTO> {
    return this.storage.getStationInfo(id)
  }
}
