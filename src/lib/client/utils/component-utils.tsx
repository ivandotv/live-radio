import { CountryDataRow } from 'components/CountryDataRow'
import { GenreDataRow } from 'components/GenreDataRow'
import { LanguageDataRow } from 'components/LanguageDataRow'
import { StationRowItem } from 'components/StationRowItem'
import { RadioModel } from 'lib/client/radio-model'
import { RadioStore } from 'lib/client/stores/radio-store'

export function createLanguageDataRow(
  _index: number,
  data: { language: string; raw: string }
) {
  return <LanguageDataRow data={data} />
}

export function createCountryDataRow(
  _index: number,
  data: { name: string; code: string; flag: string; cont: string }
) {
  return <CountryDataRow data={data} />
}

export function createGenreDataRow(
  _index: number,
  data: { genre: string; raw: string }
) {
  return <GenreDataRow data={data} />
}

export function createStationListRow(opts?: {
  showCountry?: boolean
  showFlag?: boolean
  showTags?: boolean
  showRemoveBtn?: boolean
  favoriteStations?: RadioStore
  store?: RadioStore
}) {
  const options = {
    showCountry: true,
    showFlag: true,
    showTags: true,
    showRemoveBtn: false,
    ...opts
  }

  return function StationDataRow(_: number, station: RadioModel) {
    return (
      <StationRowItem
        {...options}
        key={station.id}
        station={station}
      ></StationRowItem>
    )
  }
}
