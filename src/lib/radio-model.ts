import { Model } from '@fuerte/core'
import { FavoritesStore } from './stores/favorites-store'
import { RecentStore } from './stores/recent-store'
import { RadioDTO } from './utils/station-utils'

export function createRadioModel(data: RadioDTO) {
  return new RadioModel(data)
}

export class RadioModel extends Model<FavoritesStore | RecentStore> {
  static identityKey = 'id'

  id: string

  constructor(public data: RadioDTO) {
    super()
    this.id = data._id
  }

  override serialize() {
    return this.data
  }
}
