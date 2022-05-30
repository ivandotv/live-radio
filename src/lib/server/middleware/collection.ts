import { SERVER_CONFIG } from 'lib/server/config'
import { ApiContext } from 'lib/server/middleware/shared'
import { schemas } from 'lib/server/schemas'
import { StationCollection } from 'lib/server/utils'
import { dataToRadioDTO, RadioDTO } from 'lib/shared/utils'
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
