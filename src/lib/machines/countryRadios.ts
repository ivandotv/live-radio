import { assign, send, Machine } from 'xstate'
import { RadioStation } from '../../pages/app/browse/by-location/[continent]/country/[country]'
import * as JsSearch from 'js-search'

export function createFilterRadioMachine(stations: RadioStation[]) {
  console.log('create filter radio machine ', stations)
}

export const filterMachine = Machine(
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
                  console.log('SEARCH STATE - ', e)

                  return {
                    type: 'SEARCH',
                    query: e.query
                  }
                },
                { to: 'search-api' }
              ),
              assign((_, e) => {
                return {
                  query: e.query
                }
              })
            ]
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
        allStations: (_, event) => {
          return [...event.stations]
        },
        stations: (_, event) => {
          return [...event.stations]
        }
      })
    },
    services: {
      searchAPI: (context, event) => (callback, onReceive) => {
        // console.log('search api machine')
        // console.log('context ', context)
        console.log(' search api service : event ', event)
        // init search

        const searchAPI = new JsSearch.Search('uuid')
        searchAPI.addIndex('tags')
        searchAPI.addIndex('name')
        searchAPI.addDocuments(context.allStations)

        onReceive((e) => {
          console.log('search api onReceive ', e)
          if (e.type === 'SEARCH') {
            //     ? (searchApi.current?.search(searchValue) as RadioStation[])
            const results = searchAPI.search(e.query)
            console.log('search results ', results)
            callback({ type: 'RESULT', result: results })
          }
        })

        return () => {
          console.log('search api: cleanup function')
        }
      }
    }
  }
)
