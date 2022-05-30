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

  async load(type?: StorageType) {
    const data = await this.storage.getAllStations(this.collectionName, type)

    return { data }
  }

  save(radio: RadioModel) {
    return this.storage.saveStation(radio.id, this.collectionName)
  }

  delete(radio: RadioModel) {
    return this.storage.removeStation(radio.id, this.collectionName)
  }

  async getStationInfo(id: string): Promise<RadioDTO> {
    return this.storage.getStationInfo(id)
  }
}
