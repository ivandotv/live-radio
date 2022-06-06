import { ApiContext, ApiState } from 'lib/server/api/shared-middleware'
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
      request: { body: { collection?: string; station?: string } }
    }
  >,
  next: Koa.Next
) {
  const { station, collection } = ctx.request.body

  const { radioRepository } = ctx.deps

  if (!station) {
    ctx.status = 400
    ctx.body = { msg: 'Station ID expected' }

    return
  }

  const result = await radioRepository.deleteStation(
    ctx.state.session!.user.id,
    station,
    collection!
  )
  if (result) {
    ctx.status = 200
    ctx.body = { msg: 'deleted' }
  } else {
    ctx.status = 404
    ctx.body = { msg: 'station not found' }
  }
  await next()
}

/**
 * Validate station payload
 */

export async function validateStation(
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
  const { schemas, config } = ctx.deps

  const { error } = schemas.stationCrud.validate(ctx.request.body, {
    errors: { render: false }
  })

  if (error) {
    ctx.status = 422
    ctx.body = {
      msg: 'Not a valid Station object',
      debug: config.isProduction ? undefined : error
    }

    return
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
      request: { body: { collection?: string; station?: string } }
    }
  >,
  next: Koa.Next
) {
  const { collection, station } = ctx.request.body
  const { radioRepository, radioApi } = ctx.deps

  await radioRepository.saveStation(
    ctx.state.session!.user.id,
    station!,
    collection!
  )

  try {
    if (collection === 'favorite') {
      await radioApi.voteForStation(station!)
    }
  } catch (e) {
    //ignore errors to radio-api
  }

  ctx.status = 201
  ctx.body = { msg: 'saved' }

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
    radioApi,
    config
  } = ctx.deps

  const { error, value } = multipleStations.validate(ctx.request.body, {
    errors: { render: false }
  })

  if (error) {
    ctx.status = 422
    ctx.body = {
      msg: 'Not a valid station info payload',
      debug: config.isProduction ? undefined : error
    }

    return next()
  }

  const stations = await radioApi.getStationsById(value!.stations)

  ctx.body = dataToRadioDTO(stations)

  return next()
}

/**
 * Check if collection exists
 */

export async function checkCollectionExists(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & {
      request: { body: { collection?: string; station?: string } }
    }
  >,
  next: Koa.Next
) {
  const { collection } = ctx.request.body

  if (!collection) {
    ctx.response.status = 400
    ctx.body = { msg: 'collection name required' }

    return
  } else if (-1 === ['favorites', 'recent'].indexOf(collection)) {
    ctx.response.status = 404
    ctx.body = { msg: 'collection not found' }

    return
  }

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
  const { radioApi, logServerError } = ctx.deps
  const { id } = ctx.request.body

  try {
    if (!id) {
      ctx.body = { msg: 'station id missing' }
      ctx.status = 400

      return
    }

    await radioApi.voteForStation(id)

    ctx.body = { msg: 'ok' }
    ctx.status = 200
  } catch (e: unknown) {
    ctx.body = { msg: 'radio api unavailable' }
    ctx.status = 503

    logServerError(e, {}, ctx.url)
  }

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
    ctx.body = { msg: 'station id missing' }
    ctx.status = 400
  } else {
    const stationResponse = await radioApi.getStationsById([play])

    const stations = dataToRadioDTO(stationResponse)

    if (stations.length) {
      ctx.body = stations
    } else {
      ctx.body = { msg: 'station not found' }
      ctx.status = 404
    }
  }

  return next()
}

export async function stationClick(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & { request: { body: { id: string } } }
  >,
  next: Koa.Next
) {
  const { radioApi } = ctx.deps

  const { id } = ctx.request.body

  if (!id) {
    ctx.body = { msg: 'station id missing' }
    ctx.status = 400
  } else {
    await radioApi.sendStationClick(id)

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
    ctx.body = { msg: 'station url missing' }
    ctx.status = 400
  } else {
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
      ctx.body = {}
    }
  }

  return next()
}

export async function customSearch(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & { request: { body: { name: string } } }
  >,
  next: Koa.Next
) {
  const { radioApi, config } = ctx.deps

  const { name = '' } = ctx.request.body

  const result = await radioApi.searchStations(
    {
      name,
      limit: config.customSearchStationLimit
    },
    undefined,
    true
  )

  const stations = dataToRadioDTO(result)

  ctx.body = { stations }

  return next()
}