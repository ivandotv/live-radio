import Joi from 'joi'

// schema for validating the station payload
export const stationSchema = Joi.object().keys({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  url: Joi.string().required(),
  homepage: Joi.string().required().allow(''),
  tags: Joi.array().required().items(Joi.string().allow('')),
  language: Joi.array().required().items(Joi.string().allow('')),
  codec: Joi.string().required(),
  flag: Joi.string().required().allow(''),
  continent: Joi.string().required().allow(''),
  continentCode: Joi.string().required().allow(''),
  country: Joi.string().required().allow(''),
  countryCode: Joi.string().required().allow('')
})

export const importSchema = Joi.array().items(
  Joi.object().keys({
    station: stationSchema,
    date: Joi.date().required()
  })
)
