import timeSpan from 'time-span'

module.exports = async (config: any) => {
  const { watch, watchAll } = config

  //do not run teardown in watch mode
  if (watch || watchAll) return

  const end = timeSpan()
  console.log('teardown started')

  //tear it down
  await Promise.all(
    global.containers.map((container) => container.stop({ timeout: 10000 }))
  )

  console.log(`teardown done in: ${end.seconds()} seconds`)
}
export {}
