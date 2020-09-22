import {
  assign,
  // send,
  actions,
  Machine,
  forwardTo,
  // EventObject,
  AnyEventObject
} from 'xstate'
import * as JsSearch from 'js-search'
import { RadioStation } from '../../components/app/RadioList'

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

export type FilterRadioEvent =
  | {
      type: 'POPULATE_STATIONS'
      stations: RadioStation[]
    }
  | {
      type: 'SEARCH'
      query: string
      delay: number
    }
  | {
      type: 'CANCEL'
    }
  | {
      type: 'RESULT'
      result: RadioStation[]
    }

// type GenerateEvents<T> = T[keyof T]
// export type FinalEvents = GenerateEvents<FilterRadioEvents>

export const filterRadioMachine = Machine<
  FilterRadioContext,
  // FilterRadioSchema,
  FilterRadioEvent
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
              forwardTo('search-api', {
                delay: (context, event) => event.delay || 0,
                id: 'search-delay'
              }),
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
      // @ts-ignore
      populateStations: assign({
        allStations: (
          _,
          event: { type: 'POPULATE_STATIONS'; stations: RadioStation[] }
        ) => {
          // if (event.type === 'POPULATE_STATIONS') {
          //   return [...event.stations]
          // }

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

        onReceive((e: AnyEventObject) => {
          if (e.type === 'SEARCH') {
            // eslint-disable-next-line
            callback({ type: 'RESULT', result: searchAPI.search(e.query) })
          }
        })
      }
    }
  }
)
