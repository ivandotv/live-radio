import {
  ASYNC_STATUS,
  Collection,
  DeleteConfig,
  SaveConfig,
  unwrapResult
} from '@fuerte/core'
import { createRadioModel, RadioModel } from 'lib/radio-model'
import { appStorageFactory } from 'lib/services/storage/app-storage-service'
import { FavoriteStationsTransport } from 'lib/services/storage/favorite-stations-transport'
import { RadioDTO } from 'lib/station-utils'
import { RootStore } from 'lib/stores/root-store'

export interface RadioStore {
  saveStation(station: RadioDTO, config?: SaveConfig): Promise<any>
  deleteStation(id: string, config?: DeleteConfig): Promise<any>
  get stations(): readonly RadioModel[]
  get loadStatus(): keyof typeof ASYNC_STATUS
  loadStations(): Promise<RadioModel[]>
  getStationById(id: string): RadioModel | undefined
  removeStation(id: string): void
}

export function favoritesStoreFactory(root: RootStore) {
  return new FavoritesStore(
    root,
    createRadioModel,
    new FavoriteStationsTransport(appStorageFactory())
  )
}

/* TODO - composition over inheritance */
export class FavoritesStore
  extends Collection<
    RadioModel,
    typeof createRadioModel,
    FavoriteStationsTransport
  >
  implements RadioStore
{
  protected result!: RadioModel[]

  constructor(
    protected root: RootStore,
    factory: typeof createRadioModel,
    transport: FavoriteStationsTransport
  ) {
    super(factory, transport)
  }

  async loadStations() {
    if (!this.result && this.loadStatus !== ASYNC_STATUS.PENDING) {
      const result = await this.load()

      this.root.appShell.checkAuthError(result.error)

      this.result = unwrapResult(result).added
    }

    return this.result
  }

  async saveStation(station: RadioDTO, config?: SaveConfig) {
    let model = this.getById(station._id)
    if (!model) {
      model = this.create(station)
    }
    this.unshift(model)
    const result = await this.save(model, config)

    this.root.appShell.checkAuthError(result.error)

    return result
  }

  async deleteStation(id: string, config?: DeleteConfig) {
    const result = await this.delete(id, config)

    console.log({ result })

    // debugger
    this.root.appShell.checkAuthError(result.error)

    return result
  }

  removeStation(id: string) {
    console.log('remove station')
    this.remove(id)
  }

  get stations() {
    return this.models
  }

  getStationById(id: string) {
    return this.getById(id)
  }
}
