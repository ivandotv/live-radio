import { AppStorage } from 'lib/services/storage/app-storage-service'
import { RadioStation } from 'lib/station-utils'
import { RadioBrowserApi } from 'radio-browser-api'
import { RadioStore } from './radio-store'
import { RootStore } from './root-store'

export class FavoritesStore extends RadioStore {
  constructor(
    protected rootStore: RootStore,
    protected storage: AppStorage,
    protected radioApi: RadioBrowserApi
  ) {
    super(rootStore, storage)
  }

  async add(station: RadioStation, optimistic = false) {
    super.add(station, optimistic)
    try {
      await this.radioApi.voteForStation(station.id)
    } catch (e) {
      //todo -log error
    }
  }
}
