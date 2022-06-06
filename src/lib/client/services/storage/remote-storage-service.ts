import { client, FetchClient } from 'lib/shared/fetch-client'
import { StationCollection } from 'lib/server/utils'
import { RadioDTO } from 'lib/shared/utils'

export class AuthExpiredError extends Error {
  constructor() {
    super('Auth expired')
    this.name = 'AuthExpiredError'
  }
}

export class RemoteStorageService {
  static inject = [client]

  constructor(protected fetchClient: FetchClient) {
    this.checkAuthError = this.checkAuthError.bind(this)
  }

  async removeAllStations(collection: StationCollection) {
    return this.fetchClient(`/api/collection/${collection}`, {
      method: 'DELETE'
    }).catch(this.checkAuthError)
  }

  async addStation(station: string, collection: StationCollection) {
    return this.fetchClient('/api/station', {
      data: { station, collection }
    }).catch(this.checkAuthError)
  }

  async removeStation(station: string, collection: StationCollection) {
    return this.fetchClient(`/api/station`, {
      data: { station, collection },
      method: 'DELETE'
    }).catch(this.checkAuthError)
  }

  async importStations(
    // data: { station: string; date: string }[],
    data: Record<StationCollection, { station: string; date: string }[]>
  ): Promise<Record<StationCollection, RadioDTO[]>> {
    return this.fetchClient(`/api/collection/batch/import`, {
      data
    }).catch(this.checkAuthError)
  }

  async getStations(collection: StationCollection): Promise<RadioDTO[]> {
    return this.fetchClient(`/api/collection/${collection}`, {}).catch(
      this.checkAuthError
    )
  }

  protected checkAuthError(err: unknown) {
    if (err instanceof Response && err.status === 401) {
      throw new AuthExpiredError()
    }
    throw err
  }
}
