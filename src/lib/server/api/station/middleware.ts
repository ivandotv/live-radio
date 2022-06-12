import { ApiContext, ApiState } from 'lib/server/api/shared-middleware'
import { RadioApiError, ValidationError } from 'lib/server/server-error'
import { maybeThrowRadioError } from 'lib/server/utils'
import { dataToRadioDTO } from 'lib/shared/utils'
import { Koa } from 'nextjs-koa-api'
// @ts-expect-error - no types
import { StreamSource } from 'node-internet-radio'

/**
 * Delete station from a particular collection
 */
export async function deleteStation(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & {
      request: { query: { collection: string; station: string } }
    }
  >,
  _next: Koa.Next
) {
  const { radioRepository } = ctx.deps

  const { station, collection } = ctx.request.query

  const result = await radioRepository.deleteStation(
    ctx.state.session!.user.id,
    station,
    collection!
  )

  if (result) {
    ctx.status = 200
    ctx.body = { msg: 'ok' }
  } else {
    ctx.status = 404
    ctx.body = { msg: 'station not found' }
  }
}

/**
 * Validate station payload
 */

export async function validateStationFromBody(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & {
      request: {
        body: {
          station: string
          collection: string
        }
      }
    }
  >,
  next: Koa.Next
) {
  const { schemas } = ctx.deps

  const { error } = schemas.stationCrud.validate(ctx.request.body, {
    errors: { render: false }
  })

  if (error) {
    throw new ValidationError({ error })
  }

  return next()
}

export async function validateStationFromQuery(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & {
      request: {
        query: {
          station: string
          collection: string
        }
      }
    }
  >,
  next: Koa.Next
) {
  const { schemas } = ctx.deps

  const { error } = schemas.stationCrud.validate(ctx.request.query, {
    errors: { render: false }
  })

  if (error) {
    throw new ValidationError({ error })
  }

  await next()
}

/**
 * Handle saving station to a particular collections
 */

export async function saveStation(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & {
      request: { body: { collection: string; station: string } }
    }
  >,
  next: Koa.Next
) {
  const { collection, station } = ctx.request.body
  const { radioRepository, radioApi, logServerError } = ctx.deps

  await radioRepository.saveStation(
    ctx.state.session!.user.id,
    station,
    collection
  )

  try {
    if (collection === 'favorites') {
      await radioApi.voteForStation(station)
    }
  } catch (e) {
    //ignore errors to radio-api
    logServerError(new RadioApiError(e), ctx)
  }

  ctx.status = 201
  ctx.body = { msg: 'ok' }

  return next()
}

export async function bulkStationInfo(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & {
      request: { body: { stations: string[] } }
    }
  >,
  next: Koa.Next
) {
  const {
    schemas: { multipleStations },
    radioApi
  } = ctx.deps

  const { error, value } = multipleStations.validate(ctx.request.body, {
    errors: { render: false }
  })

  if (error) {
    throw new ValidationError({ error })
  }

  const stations = await maybeThrowRadioError(
    radioApi.getStationsById(value!.stations)
  )
  ctx.body = dataToRadioDTO(stations)

  return next()
}

export async function voteForStation(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & {
      request: { body: { id: string } }
    }
  >,
  next: Koa.Next
) {
  const { radioApi } = ctx.deps
  const { id } = ctx.request.body

  if (!id) {
    throw new ValidationError({ dev: 'station id missing' })
  }

  await maybeThrowRadioError(radioApi.voteForStation(id))

  ctx.body = { msg: 'ok' }
  ctx.status = 200

  return next()
}

export async function stationInfo(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & { request: { query: { play: string } } }
  >,
  next: Koa.Next
) {
  const { radioApi } = ctx.deps

  const { play } = ctx.request.query
  if (!play) {
    throw new ValidationError({ dev: 'station id missing' })
  } else {
    const stations = await maybeThrowRadioError(
      radioApi.getStationsById([play])
    )

    const station = dataToRadioDTO(stations)

    if (station.length) {
      ctx.body = station
    } else {
      ctx.body = { msg: 'station not found' }
      ctx.status = 404
    }
  }

  return next()
}

export async function countStationClick(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & { request: { body: { id: string } } }
  >,
  next: Koa.Next
) {
  const { radioApi, logServerError } = ctx.deps

  const { id } = ctx.request.body

  if (!id) {
    throw new ValidationError({ body: { msg: 'station id missing' } })
  } else {
    try {
      await radioApi.sendStationClick(id)
    } catch (e) {
      logServerError(new RadioApiError(e), ctx)
    }

    ctx.body = { msg: 'ok' }
    ctx.status = 200
  }

  return next()
}

export async function songInfo(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & { request: { query: { station?: string } } }
  >,
  next: Koa.Next
) {
  const { getSongInfo } = ctx.deps
  const { station } = ctx.request.query

  if (!station) {
    throw new ValidationError({ body: { msg: 'station url missing' } })
  } else {
    try {
      const response: { title: string } = await getSongInfo(
        station,
        StreamSource.STREAM
      )

      const songData = response.title.split('-')
      if (songData.length > 1) {
        ctx.body = {
          artist: songData[0].trim(),
          title: songData[1].trim()
        }
      } else {
        ctx.status = 204
      }
    } catch (e) {
      // ignore errors to song info api
      ctx.status = 204
    }
  }

  return next()
}

export async function customSearch(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & { request: { body: { query: string } } }
  >,
  next: Koa.Next
) {
  const { radioApi, config } = ctx.deps

  const { query } = ctx.request.body

  if (query === undefined) {
    throw new ValidationError({ dev: 'body missing' })
  }
  if (query.length) {
    const result = await maybeThrowRadioError(
      radioApi.searchStations(
        {
          name: query,
          limit: config.customSearchStationLimit
        },
        undefined,
        true
      )
    )
    const stations = dataToRadioDTO(result)

    ctx.body = { stations }
  } else {
    ctx.body = { stations: [] }
  }

  return next()
}
