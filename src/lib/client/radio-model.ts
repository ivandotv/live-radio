import { Model } from '@fuerte/core'
import { RadioDTO } from 'lib/shared/utils'

export function createRadioModel(data: RadioDTO) {
  return new RadioModel(data)
}

export class RadioModel extends Model {
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
