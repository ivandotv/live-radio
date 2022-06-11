import { RadioBrowserApi } from 'radio-browser-api'
import { getMockStation } from './station-mock'

export type RadioBrowserMock = ReturnType<typeof createRadioBrowserMock>

type RadioMock = { [K in keyof RadioBrowserApi]: jest.Mock }

export function createRadioBrowserMock(override: Partial<RadioMock> = {}) {
  return {
    getStationsById: jest.fn().mockResolvedValue([getMockStation()]),
    ...override
  }
}
