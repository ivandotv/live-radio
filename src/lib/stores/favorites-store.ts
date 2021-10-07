import {
  ASYNC_STATUS,
  Collection,
  DeleteConfig,
  unwrapResult
} from '@fuerte/core'
import { createRadioModel, RadioModel } from 'lib/radio-model'
import { appStorageFactory } from 'lib/services/storage/app-storage-service'
import { FavoriteStationsTransport } from 'lib/services/storage/favorite-stations-transport'
import { RadioDTO } from 'lib/station-utils'
import { RootStore } from 'lib/stores/root-store'
import { client } from 'lib/utils'

export interface RadioStore extends Collection<RadioModel, any, any> {
  saveStation(station: RadioDTO): any
  deleteStation(id: string, config: DeleteConfig): any
  get stations(): readonly RadioModel[]
}

export function favoritesStoreFactory(_root: RootStore) {
  return new FavoritesStore(
    createRadioModel,
    new FavoriteStationsTransport(appStorageFactory())
  )
}

export class FavoritesStore
  extends Collection<
    RadioModel,
    typeof createRadioModel,
    FavoriteStationsTransport
  >
  implements RadioStore
{
  protected result!: RadioModel[]

  async loadStations() {
    if (!this.result && this.loadStatus !== ASYNC_STATUS.PENDING) {
      this.result = unwrapResult(await super.load()).added
    }

    return this.result
  }

  async saveStation(station: RadioDTO) {
    let model = this.getById(station._id)
    if (!model) {
      model = this.create(station)
    }
    this.unshift(model)
    const result = unwrapResult(await super.save(model))

    try {
      await client('/api/vote-for-station', { data: { id: station._id } })
    } catch (e) {
      //TODO -log error silently
    }

    return result
  }

  async deleteStation(id: string, config?: DeleteConfig) {
    return await super.delete(id, config)
  }

  get stations() {
    return this.models
  }
}
