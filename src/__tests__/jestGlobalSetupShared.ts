import path from 'node:path'
import * as dotenv from 'dotenv'

dotenv.config({
  debug: true,
  override: true,
  path: path.resolve(__dirname, '.env')
})
