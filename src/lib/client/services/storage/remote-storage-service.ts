import { StationCollection } from 'lib/server/utils'
import { client } from 'lib/client/utils/misc-utils'
import { RadioDTO } from 'lib/shared/utils'

export class AuthExpiredError extends Error {
  constructor() {
    super('Auth expired')
    this.name = 'AuthExpiredError'
  }
}

export class RemoteStorageService {
  constructor(protected transport: typeof client) {
    this.checkAuthError = this.checkAuthError.bind(this)
  }

  async removeAllStations(collection: StationCollection) {
    return this.transport(`/api/collection/delete/${collection}`, {
      method: 'DELETE'
    }).catch(this.checkAuthError)
  }

  async addStation(station: RadioDTO, collection: StationCollection) {
    return this.transport(`/api/stations/${collection}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ station })
    }).catch(this.checkAuthError)
  }

  async removeStation(id: string, collection: StationCollection) {
    return this.transport(`/api/stations/${collection}?id=${id}`, {
      method: 'DELETE'
    }).catch(this.checkAuthError)
  }

  async importStations(
    data: { station: RadioDTO; date: string }[],
    collection: StationCollection
  ): Promise<any> {
    return this.transport(`/api/collection/import/${collection}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stations: data, collection })
    }).catch(this.checkAuthError)
  }

  async getStations(collection: StationCollection): Promise<RadioDTO[]> {
    return this.transport(`/api/stations/${collection}`, {
      method: 'GET'
    }).catch(this.checkAuthError)
  }

  protected checkAuthError(err: unknown) {
    if (err instanceof Response && err.status === 401) {
      throw new AuthExpiredError()
    }
    throw err
  }
}
