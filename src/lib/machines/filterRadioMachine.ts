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
import { RadioStation } from '../../components/app/ListStations'

// export function createFilterRadioMachine(stations: RadioStation[]) {
//   console.log('create filter radio machine ', stations)
// }
export interface FilterRadioContext {
  allStations: RadioStation[]
  filteredStations: RadioStation[]
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
      filteredStations: [],
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
              () => {}

              // assign((_, e) => {
              //   return {
              //     query: e.query
              //   }
              // }),
              // actions.cancel('search-delay')
              // forwardTo('search-api', {
              //   delay: (context, event) => event.delay || 0,
              //   id: 'search-delay'
              // })
            ]
          },
          // CANCEL: {
          //   actions: [actions.cancel('search-delay')]
          // },
          RESULT: {
            actions: assign((ctx, e) => {
              let r
              console.log('result called query: ', e.query)
              if (e.query.length === 0) {
                r = ctx.allStations
              } else {
                r = e.result
              }

              return {
                filteredStations: r,
                query: e.query
                // e.result.length === 0 ? ctx.allStations : e.result
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
        filteredStations: (_, event) => {
          return [...event.stations]
        }
      })
    },
    services: {
      searchAPI: (context, _event) => (send, onReceive) => {
        // init search
        const searchAPI = new JsSearch.Search('uuid')
        searchAPI.addIndex('tags')
        searchAPI.addIndex('name')
        searchAPI.addDocuments(context.allStations)

        onReceive((e: AnyEventObject) => {
          if (e.type === 'SEARCH') {
            // eslint-disable-next-line
            const result = e.query.length === 0 ? [] : searchAPI.search(e.query)

            console.log('search ', e.query)
            console.log('result ', result)

            send({
              type: 'RESULT',
              result,
              query: e.query
              // result.length === 0 ? null : result
            })
          }
        })
      }
    }
  }
)
