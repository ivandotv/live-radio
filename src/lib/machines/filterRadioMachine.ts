import {
  assign,
  send,
  actions,
  Machine,
  // EventObject,
  AnyEventObject
} from 'xstate'
import { RadioStation } from '../../pages/app/browse/by-location/[continent]/country/[country]'
import * as JsSearch from 'js-search'

// export function createFilterRadioMachine(stations: RadioStation[]) {
//   console.log('create filter radio machine ', stations)
// }
export interface FilterRadioContext {
  allStations: RadioStation[]
  stations: RadioStation[]
  query: string
}
export interface FilterRadioSchema {
  states: {
    idle: {}
    search: {}
  }
}
type PopulateStationsEvent = {
  type: 'POPULATE_STATIONS'
  stations: RadioStation[]
}

type FilterRadioEvents = {
  POPULATE_STATIONS: {
    type: 'POPULATE_STATIONS'
    stations: RadioStation[]
  }
  SEARCH: {
    type: 'SEARCH'
    query: string
    delay: number
  }
  CANCEL: {
    type: 'CANCEL'
  }
  RESULT: {
    type: 'RESULT'
    result: RadioStation[]
  }
}

type GenerateEvents<T> = T[keyof T]
export type FinalEvents = GenerateEvents<FilterRadioEvents>

export const filterRadioMachine = Machine<
  FilterRadioContext,
  FilterRadioSchema,
  FinalEvents
>(
  {
    id: 'radio-stations',
    strict: true,
    initial: 'idle',
    context: {
      allStations: [],
      stations: [],
      query: ''
    },
    states: {
      idle: {
        on: {
          POPULATE_STATIONS: {
            actions: 'populateStations',
            target: 'search'
          }
        }
      },
      search: {
        invoke: {
          id: 'search-api',
          src: 'searchAPI'
        },
        on: {
          SEARCH: {
            actions: [
              send(
                (ctx, e) => {
                  return {
                    type: 'SEARCH',
                    query: e.query,
                    delay: e.delay
                  }
                },
                {
                  to: 'search-api',
                  delay: (context, event) => event.delay || 0,
                  id: 'search-delay'
                }
              ),
              assign((_, e) => {
                return {
                  query: e.query
                }
              })
            ]
          },
          CANCEL: {
            actions: [actions.cancel('search-delay')]
          },
          RESULT: {
            actions: assign((ctx, e) => {
              return {
                stations: e.result.length === 0 ? ctx.allStations : e.result
              }
            })
          }
        }
      }
    }
  },
  {
    actions: {
      populateStations: assign({
        allStations: (_, event: FilterRadioEvents['POPULATE_STATIONS']) => {
          return [...event.stations]
        },
        stations: (_, event) => {
          return [...event.stations]
        }
      })
    },
    services: {
      searchAPI: (context, _event) => (callback, onReceive) => {
        // init search
        const searchAPI = new JsSearch.Search('uuid')
        searchAPI.addIndex('tags')
        searchAPI.addIndex('name')
        searchAPI.addDocuments(context.allStations)

        onReceive((e) => {
          if (e.type === 'SEARCH') {
            // eslint-disable-next-line
            callback({ type: 'RESULT', result: searchAPI.search(e.query) })
          }
        })
      }
    }
  }
)
