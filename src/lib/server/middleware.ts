import { isProduction } from 'lib/server/config'
import { RadioRepository } from 'lib/server/radio-repository'
import { importSchema, stationSchema } from 'lib/server/schemas'
import { StationCollection } from 'lib/server/utils'
import { dataToRadioDTO, RadioDTO } from 'lib/shared/utils'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { Koa } from 'nextjs-koa-api'
import { RadioBrowserApi } from 'radio-browser-api'

export interface ApiContext extends Koa.DefaultContext {
  session?: Session
  sessionCheck: typeof getSession
  radioRepository: RadioRepository
  radioApi: RadioBrowserApi
}

/**
 * Check if user is authenticated
 */
export async function setupSession(
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
  const { error } = stationSchema.validate(ctx.request.body.station, {
    errors: { render: false }
  })

  if (error) {
    // return res.status(422).json({
    //   msg: 'Not a valid Station object',
    //   debug: isProduction ? undefined : error
    // })

    ctx.status = 422
    ctx.body = {
      msg: 'Not a valid Station object',
      debug: isProduction ? undefined : error
    }

    return
  }

  await next()
}

/**
 * Validate array of stations payload
 */
export async function bulkValidateStations(
  ctx: Koa.ParameterizedContext<
    Koa.DefaultState,
    ApiContext & { request: { body: { stations: RadioDTO[] } } }
  >,
  next: Koa.Next
) {
  const { error } = importSchema.validate(ctx.request.body.stations, {
    errors: { render: false }
  })

  if (error) {
    ctx.status = 422
    ctx.body = {
      msg: 'Not all stations are valid',
      debug: isProduction ? undefined : error
    }

    return
  }

  await next()
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

  const stationIds = await radioRepository.getUserCollection(
    ctx.session!.user.id,
    collection
  )

  const stations = await radioApi.getStationsById(stationIds)

  ctx.body = dataToRadioDTO(stations)

  await next()
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

  await ctx.radioRepository.save(
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

  const result = await ctx.radioRepository.delete(
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

  const result = await ctx.radioRepository.deleteUserCollection(
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
  const collection = ctx.request.params.collection

  await ctx.radioRepository.import(
    ctx.session!.user.id,
    ctx.request.body.stations,
    collection
  )

  ctx.body = { msg: 'saved' }
  ctx.status = 201
  await next()
}
