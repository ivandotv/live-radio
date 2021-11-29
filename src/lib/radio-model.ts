import { Model } from '@fuerte/core'
import { RadioDTO } from './station-utils'
import { FavoritesStore } from './stores/favorites-store'
import { RecentStore } from './stores/recent-store'

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
