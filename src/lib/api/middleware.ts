import Joi from 'joi'
import { isProduction } from 'app-config'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { Session } from 'next-auth'
import { NextHandler } from 'next-connect'

export type NextApiRequestWithSession = NextApiRequest & {
  session?: Session
}

/**
 * Check if user is authenticated
 */
export async function setupSession(
  req: NextApiRequestWithSession,
  res: NextApiResponse,
  next: NextHandler
) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ msg: 'Unauthorized' })
  }
  req.session = session
  next()
}

// schema for validating the station payload
const stationSchema = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string().required(),
  url: Joi.string().required(),
  homepage: Joi.string().required(),
  tags: Joi.array().required().items(Joi.string().allow('')),
  language: Joi.array().required().items(Joi.string().allow('')),
  codec: Joi.string().required(),
  flag: Joi.string().required().allow(''),
  continent: Joi.string().required().allow(''),
  continentCode: Joi.string().required().allow(''),
  country: Joi.string().required().allow(''),
  countryCode: Joi.string().required().allow('')
})

/**
 * Validates station payload
 * @param req
 * @param res
 * @param next
 * @returns
 */
export function validateStation(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const { error } = stationSchema.validate(req.body, {
    errors: { render: false }
  })
  if (error) {
    return res.status(422).json({
      msg: 'Not a valid Station object',
      debug: isProduction ? undefined : error
    })
  }

  next()
}
