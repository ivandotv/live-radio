import { RadioStore } from './radio-store'

export class RecentStationsStore extends RadioStore {
  protected resolveStations() {
    return this.storage.getRecentStations()
  }
}
