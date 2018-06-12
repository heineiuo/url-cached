export default (stream) => new Promise((resolve, reject) => {
  let buf = Buffer.from([])
  stream.on('data', (chunk) => {
    buf = Buffer.concat([buf, chunk])
  })
  stream.on('end', () => {
    resolve(buf)
  })
  stream.once('error', reject)
})
