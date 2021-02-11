import Joi from 'joi'
import { isProduction } from 'app-confg'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from 'next-auth/client'
import { NextHandler } from 'next-connect'
export type SessionWithUserId = Session & { id: string }
export type NextApiRequestWithSession = NextApiRequest & SessionWithUserId
export async function setupSession(
  req: NextApiRequestWithSession,
  res: NextApiResponse,
  next: NextHandler
) {
  const session = (await getSession({ req })) as Session & {
    user: { id: string }
  }
  if (!session) {
    return res.status(401).json({ msg: 'Not Authorized' })
  }
  req.session = session
  next()
}

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
