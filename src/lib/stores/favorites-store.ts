import { AppStorage } from 'lib/services/storage/app-storage-service'
import { RadioStation } from 'lib/station-utils'
import { client } from 'lib/utils'
import { RadioStore } from './radio-store'
import { RootStore } from './root-store'

export class FavoritesStore extends RadioStore {
  constructor(
    protected rootStore: RootStore,
    protected storage: AppStorage,
    protected transport: typeof client
  ) {
    super(rootStore, storage)
  }

  async add(station: RadioStation, optimistic = false) {
    await super.add(station, optimistic)
    try {
      await client('/api/vote-for-station', { data: { id: station.id } })
    } catch (e) {
      //todo -log error
    }
  }
}
