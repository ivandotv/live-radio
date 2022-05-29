import Joi from 'joi'
//NOTE: do not remove, leave for future reference

// schema for validating the station payload
// export const stationSchema = Joi.object().keys({
//   _id: Joi.string().required(),
//   name: Joi.string().required(),
//   url: Joi.string().required(),
//   homepage: Joi.string().required().allow(''),
//   tags: Joi.array().required().items(Joi.string().allow('')),
//   language: Joi.array().required().items(Joi.string().allow('')),
//   codec: Joi.string().required(),
//   flag: Joi.string().required().allow(''),
//   continent: Joi.string().required().allow(''),
//   continentCode: Joi.string().required().allow(''),
//   country: Joi.string().required().allow(''),
//   countryCode: Joi.string().required().allow('')
// })

const station = Joi.string().required()

const multipleStations = Joi.array().items(station)

const importStations = Joi.object().keys({
  favorites: Joi.array()
    .required()
    .items(
      Joi.object().keys({
        station: station,
        date: Joi.date().required()
      })
    ),
  recent: Joi.array()
    .required()
    .items(
      Joi.object().keys({
        station: station,
        date: Joi.date().required()
      })
    )
})

export const schemas = {
  importStations,
  station,
  multipleStations
}
