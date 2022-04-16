module.exports = async (config: any) => {
  const { watch, watchAll } = config

  //do not run teardown in watch mode
  if (watch || watchAll) return

  console.log('Global teardown started')
  //tear id down
  const stopped = []
  for (const container of global.containers) {
    stopped.push(container.stop({ timeout: 5000 }))
  }

  await Promise.all(stopped)

  console.log('Global teardown done')
}
export {}
