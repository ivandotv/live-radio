import { ServerConfig, SERVER_CONFIG } from 'lib/server/config'
import { RadioRepository } from 'lib/server/radio-repository'
import { schemas } from 'lib/server/schemas'
import { logServerError, StationCollection } from 'lib/server/utils'
import { dataToRadioDTO, RadioDTO } from 'lib/shared/utils'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { Koa } from 'nextjs-koa-api'
import { PumpIt } from 'pumpit'
import { RadioBrowserApi } from 'radio-browser-api'

export interface ApiContext extends Koa.DefaultContext {
  session?: Session
  sessionCheck: typeof getSession
  radioRepository: RadioRepository
  radioApi: RadioBrowserApi
  logServerError: typeof logServerError
  info: {
    isProduction: boolean
  }
}

/** Build koa api context*/
export function buildCtx(container: PumpIt) {
  return async (
    ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
    next: Koa.Next
  ) => {
    ctx.radioRepository = container.resolve<RadioRepository>(RadioRepository)
    ctx.sessionCheck = container.resolve<typeof getSession>(getSession)
    ctx.radioApi = container.resolve<RadioBrowserApi>(RadioBrowserApi)
    ctx.logServerError =
      container.resolve<typeof logServerError>(logServerError)
    ctx.info = {
      isProduction: container.resolve<ServerConfig>('config').isProduction
    }
    await next()
  }
}

/**
 * Check if user is authenticated
 */
export async function checkSession(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
  next: Koa.Next
) {
  const session = await getSession({ req: ctx.req })
  if (!session) {
    ctx.status = 401
    ctx.body = { msg: 'Unauthorized' }

    return
  } else {
    ctx.session = session
  }

  await next()
}

/**
 * Validate station payload
 */

export async function validateStation(
  ctx: Koa.ParameterizedContext<
    Koa.DefaultState,
    {
      request: {
        body: {
          stations: string
        }
        params: {
          collection: StationCollection
        }
      }
    }
  >,
  next: Koa.Next
) {
  const { error } = schemas.station.validate(ctx.request.body.station, {
    errors: { render: false }
  })

  if (error) {
    ctx.status = 422
    ctx.body = {
      msg: 'Not a valid Station object',
      debug: SERVER_CONFIG.isProduction ? undefined : error
    }

    return
  }

  await next()
}

/**
 * Validate array of stations payload
 */
export async function validateImportStations(
  ctx: Koa.ParameterizedContext<
    Koa.DefaultState,
    ApiContext & { request: { body: { stations: RadioDTO[] } } }
  >,
  next: Koa.Next
) {
  const { error } = schemas.importStations.validate(ctx.request.body.stations, {
    errors: { render: false }
  })

  if (error) {
    ctx.status = 422
    ctx.body = {
      msg: 'Not all stations are valid',
      debug: SERVER_CONFIG.isProduction ? undefined : error
    }

    return
  }

  return next()
}

/**
 * Check if collection exists
 */

export async function checkCollectionExists(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
  next: Koa.Next
) {
  const collectionName = ctx.params.collection

  if (!collectionName) {
    ctx.response.status = 400
    ctx.body = { msg: 'collection name required' }

    return
  } else if (-1 === ['favorites', 'recent'].indexOf(collectionName)) {
    ctx.response.status = 404
    ctx.body = { msg: 'collection not found' }

    return
  }
  await next()
}

/**
 * Get user collection
 */
export async function getUserCollection(
  ctx: Koa.ParameterizedContext<
    Koa.DefaultState,
    ApiContext & {
      request: {
        params: {
          collection: StationCollection
        }
      }
    }
  >,
  next: Koa.Next
) {
  const { radioApi, radioRepository } = ctx
  const collection: StationCollection = ctx.params.collection

  const stationIds = await radioRepository.getCollection(
    ctx.session!.user.id,
    collection
  )

  const stations = await radioApi.getStationsById(stationIds)

  ctx.body = dataToRadioDTO(stations)

  return next()
}

/**
 * Handle saving station to a particular collections
 */
export async function saveStation(
  ctx: Koa.ParameterizedContext<
    Koa.DefaultState,
    ApiContext & {
      request: {
        body: {
          stations: RadioDTO[]
        }
        params: {
          collection: StationCollection
        }
      }
    }
  >,
  next: Koa.Next
) {
  const collection: StationCollection = ctx.params.collection

  await ctx.radioRepository.saveStation(
    ctx.session!.user.id,
    ctx.request.body.station,
    collection
  )

  ctx.status = 201
  ctx.body = { msg: 'saved' }
  await next()
}

/**
 * Delete station from a particular collection
 */
export async function deleteStation(
  ctx: Koa.ParameterizedContext<
    Koa.DefaultState,
    ApiContext & {
      request: {
        params: {
          collection: StationCollection
          id: string
        }
      }
    }
  >,
  next: Koa.Next
) {
  const collection: StationCollection = ctx.request.params.collection
  const id = ctx.request.query.id as string | undefined

  if (!id) {
    ctx.status = 400
    ctx.body = { msg: 'Station ID expected' }

    return
  }

  const result = await ctx.radioRepository.deleteStation(
    ctx.session!.user.id,
    id,
    collection
  )
  if (result) {
    ctx.status = 200
    ctx.body = { msg: 'deleted' }
  } else {
    // return res.status(404).json({ msg: 'not found' })
    ctx.status = 404
    ctx.body = { msg: 'station not found' }
  }
  await next()
}

/**
 * Deletes the whole collection
 */
export async function deleteCollection(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
  next: Koa.Next
) {
  const collection = ctx.params.collection

  const result = await ctx.radioRepository.deleteCollection(
    ctx.session!.user.id,
    collection
  )
  if (result) {
    ctx.body = { msg: 'deleted' }
  } else {
    ctx.status = 404
    ctx.body = { msg: 'collection not found' }
  }
  await next()
}

/**
 * Validate array of stations payload
 */
export async function importStations(
  ctx: Koa.ParameterizedContext<
    Koa.DefaultState,
    ApiContext & {
      request: {
        params: {
          collection: StationCollection
        }
      }
    }
  >,
  next: Koa.Next
) {
  // const collection = ctx.request.params.collection

  const payload = ctx.request.body as Record<
    StationCollection,
    { station: string; date: string }[]
  >

  //TODO - make single import call
  const favImportPromise = ctx.radioRepository.importCollection(
    ctx.session!.user.id,
    payload.favorites.map((data) => ({
      _id: data.station,
      date: new Date(data.date)
    })),
    'favorites'
  )

  const recentImportPromise = ctx.radioRepository.importCollection(
    ctx.session!.user.id,
    payload.recent.map((data) => ({
      _id: data.station,
      date: new Date(data.date)
    })),
    'recent'
  )

  await Promise.all([favImportPromise, recentImportPromise])

  //TODO - make single radio api call
  const [favorites, recent] = await Promise.all([
    payload.favorites.length > 0
      ? ctx.radioApi.getStationsById(
          payload.favorites.map((data) => data.station)
        )
      : [],
    payload.recent.length > 0
      ? ctx.radioApi.getStationsById(payload.recent.map((data) => data.station))
      : []
  ])

  // const radioDTOS = dataToRadioDTO(favorites.concat(recent))

  ctx.body = {
    favorites: dataToRadioDTO(favorites),
    recent: dataToRadioDTO(recent)
  }

  ctx.status = 201

  return next()
}

export async function bulkStationInfo(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
  next: Koa.Next
) {
  const ids = (ctx.request.body.stations || []) as string[]

  const { error } = schemas.multipleStations.validate(ids, {
    errors: { render: false }
  })

  if (error) {
    ctx.status = 422
    ctx.body = {
      msg: 'Not a valid station info payload',
      debug: SERVER_CONFIG.isProduction ? undefined : error
    }

    return next()
  }

  const stations = await ctx.radioApi.getStationsById(ids)

  ctx.body = dataToRadioDTO(stations)

  return next()
}

/**
 * Logs error
 */
export async function logError(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, ApiContext>,
  next: Koa.Next
) {
  try {
    await next()
  } catch (err: any) {
    err.status = err.statusCode || err.status || 500

    ctx.logServerError(
      err,
      {
        tags: {
          endpoint: ctx.endpoint
        }
      },
      ctx.url
    )

    ctx.status = err.status
    ctx.body = ctx.info.isProduction ? 'internal server error' : err.message

    ctx.app.emit('error', err, ctx)
  }
}
