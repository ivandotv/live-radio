import path from 'node:path'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
  //   debug: true,
  override: true,
  path: path.resolve(__dirname, '../', '.env')
})
