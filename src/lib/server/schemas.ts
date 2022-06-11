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

const multipleStations = Joi.object<{ stations: string[] }>()
  .keys({
    stations: Joi.array().items(station).required()
  })
  .required()

const importStations = Joi.object<{
  favorites: { station: string; date: string }
  recent: { station: string; date: string }
}>()
  .keys({
    favorites: Joi.array()
      .items(
        Joi.object().keys({
          station: station,
          date: Joi.date().required()
        })
      )
      .required(),
    recent: Joi.array()
      .items(
        Joi.object().keys({
          station: station,
          date: Joi.date().required()
        })
      )
      .required()
  })
  .required()

const stationCrud = Joi.object()
  .keys({
    station,
    collection: Joi.string().equal('favorites', 'recent').required()
  })
  .required()

export const schemas = {
  importStations,
  station,
  stationCrud,
  multipleStations
}
