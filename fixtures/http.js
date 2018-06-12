var urlcached = require('..')()

process.nextTick(async () => {
  try {
    const text = await urlcached.read('https://unpkg.com/deno_testing@0.0.5/testing.ts', 'utf8')
    console.log(text)
  } catch (e) {
    console.log(e)
  }
})
