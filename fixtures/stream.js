var UrlCached = require('../index.js')

console.log(UrlCached)
console.log(require('../index.js'))
var urlcached = UrlCached()

process.nextTick(async () => {
  try {
    console.time('stream')
    let buf = Buffer.from([])
    const rs = await urlcached.createReadStream('https://cdn.jsdelivr.net/npm/react-dom@16.4.0/cjs/react-dom.development.min.js', 'utf8')
    rs.on('data', (chunk) => {
      buf = Buffer.concat([buf, chunk])
    })
    rs.on('end', () => {
      console.timeEnd('stream')
      console.log(buf.toString('utf8').length)
    })

    console.time('read')

    let text = await urlcached.read('https://cdn.jsdelivr.net/npm/react-dom@16.4.0/cjs/react-dom.development.min.js', 'utf8')
    console.timeEnd('read')
    console.log(text.length)
  } catch (e) {
    console.log(e)
  }
})
