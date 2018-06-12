var urlcached = require('..')()

process.nextTick(async () => {
  const text = await urlcached.read('file:///', 'utf8')
  console.log(text)
})
