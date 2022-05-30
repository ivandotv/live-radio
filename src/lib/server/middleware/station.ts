import { SERVER_CONFIG } from 'lib/server/config'
import { schemas } from 'lib/server/schemas'
import { StationCollection } from 'lib/server/utils'
import { dataToRadioDTO, RadioDTO } from 'lib/shared/utils'
import { Koa } from 'nextjs-koa-api'
import { ApiContext } from 'lib/server/middleware/shared'
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
