import { ApiContext, ApiState } from 'lib/server/api/shared-middleware'
import { PublicServerError, ServerError } from 'lib/server/server-error'
import { maybeThrowRadioError, StationCollection } from 'lib/server/utils'
import { dataToRadioDTO } from 'lib/shared/utils'
import { Koa } from 'nextjs-koa-api'

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
  const { radioApi, radioRepository } = ctx.deps
  const { collection } = ctx.request.params

  const stationIds = await radioRepository.getCollection(
    ctx.state.session!.user.id,
    collection
  )

  if (stationIds.length) {
    const stations = await maybeThrowRadioError(
      radioApi.getStationsById(stationIds)
    )

    ctx.body = dataToRadioDTO(stations)
  } else {
    ctx.body = []
  }

  return next()
}

/**
 * Validate array of stations payload
 */
export async function validateImportStations(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & {
      request: {
        body: {
          favorites: { station: string; date: string }[]
          recent: { station: string; date: string }[]
        }
      }
    }
  >,
  next: Koa.Next
) {
  const {
    schemas: { importStations },
    config
  } = ctx.deps

  const { error } = importStations.validate(ctx.request.body, {
    errors: { render: false }
  })

  if (error) {
    ctx.status = 422
    ctx.body = {
      msg: 'Not all stations are valid',
      debug: config.isProduction ? undefined : error
    }

    return
  }

  return next()
}

/**
 * Deletes the whole collection
 */
export async function deleteCollection(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & { request: { params: { collection: string } } }
  >,
  next: Koa.Next
) {
  const { collection } = ctx.request.params
  const { radioRepository } = ctx.deps

  const result = await radioRepository.deleteCollection(
    ctx.state.session!.user.id,
    collection
  )
  if (result) {
    ctx.body = { msg: 'success' }
  } else {
    throw new ServerError()
  }

  return next()
}

/**
 * Validate array of stations payload
 */
export async function importStations(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & {
      request: {
        body: {
          favorites: { station: string; date: string }[]
          recent: { station: string; date: string }[]
        }
      }
    }
  >,
  next: Koa.Next
) {
  const { radioRepository, radioApi } = ctx.deps

  const payload = ctx.request.body as Record<
    StationCollection,
    { station: string; date: string }[]
  >

  //TODO - make single import call
  const favImportPromise = radioRepository.importCollection(
    ctx.state.session!.user.id,
    payload.favorites.map((data) => ({
      _id: data.station,
      date: new Date(data.date)
    })),
    'favorites'
  )

  const recentImportPromise = radioRepository.importCollection(
    ctx.state.session!.user.id,
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
      ? radioApi.getStationsById(payload.favorites.map((data) => data.station))
      : [],
    payload.recent.length > 0
      ? radioApi.getStationsById(payload.recent.map((data) => data.station))
      : []
  ])

  ctx.body = {
    favorites: dataToRadioDTO(favorites),
    recent: dataToRadioDTO(recent)
  }

  ctx.status = 201

  return next()
}

/**
 * Check if collection exists
 */

export async function validateCollectionPayload(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & { request: { params: { collection: string } } }
  >,
  next: Koa.Next
) {
  const { collection } = ctx.request.params

  if (['favorites', 'recent'].indexOf(collection)) {
    throw new PublicServerError({
      body: { msg: 'collection not found' },
      status: 404
    })
  }
  await next()
}
