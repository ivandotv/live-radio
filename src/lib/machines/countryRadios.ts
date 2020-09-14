import { assign, send, Machine } from 'xstate'
import { RadioStation } from '../../pages/app/browse/by-location/[continent]/country/[country]'

export function createFilterRadioMachine(stations: RadioStation[]) {
  console.log('create filter radio machine ', stations)
}

export const filterMachine = Machine(
  {
    id: 'radio-stations',
    initial: 'idle',
    context: {
      stations: [],
      searchResult: null
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
            actions: send(
              (ctx, e) => {
                return { type: 'SEARCH', test: e.test }
              },
              { to: 'search-api' }
            )
          },
          RESULT: {
            actions: assign({
              searchResult: (_, e) => {
                // console.log('assign from result', e)

                return e.result
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
        stations: (_, event) => {
          // console.log('action - populate stations', event)

          return event.stations
        }
      })
    },
    services: {
      searchAPI: (context, event) => (callback, onReceive) => {
        // console.log('search api machine')
        // console.log('context ', context)
        // console.log('event ', event)
        onReceive((e) => {
          if (e.type === 'SEARCH') {
            // callback('PONG')
            // console.log('do the search', e)
            const haystack = e.haystack
            if (e.test === 'even') {
              // console.log('do the callback')
              callback({ type: 'RESULT', result: 'hello' })
            }
          }
        })

        // // Perform cleanup
        // return () => clearInterval(id);
        return () => {
          // console.log('cleanup function')
        }
      }
    }
  }
)
