import _fs from 'fs'
import path from 'path'
import { Readable } from 'readable-stream'
import sha1 from 'js-sha1'
import fetch from 'node-fetch'
import { promisify } from 'util'

const fs = {
  createReadStream: _fs.createReadStream,
  writeFile: promisify(_fs.writeFile),
  open: promisify(_fs.open),
  unlink: promisify(_fs.unlink),
  access: promisify(_fs.access),
  stat: promisify(_fs.stat)
}

class URLCachedStream extends Readable {
  constructor (url, options) {
    super()
    if (!(this instanceof URLCachedStream)) return new URLCachedStream(url)
    Readable.call(this)
    this.options = options
    this.url = url
  }

  prepare = async () => {
    if (this.preparing) return false
    this.preparing = true
    const hex = sha1(this.url.href)
    const now = Date.now()
    const physicalPath = path.resolve(this.options.cacheDir, hex)
    const fatalPath = physicalPath + '.fatal'
    let shouldUpdate = false
    let hasFatal = false
    try {
      const stat = await fs.stat(physicalPath)
      if (this.options.reload && this.options.ctime > stat.mtime.getTime()) {
        shouldUpdate = true
      }
      if (this.options.expire > 0 && now > this.options.expire + stat.mtime.getTime()) {
        shouldUpdate = true
      }
      if (this.options.retryInterval > 0) {
        try {
          const fatalStat = await fs.stat(fatalPath)
          hasFatal = true
          if (now > this.options.retryInterval + fatalStat.mtime.getTime()) {
            shouldUpdate = true
          }
        } catch (e) {
          // no fatal here
        }
      }
    } catch (e) {
      if (e.code === 'ENOENT') {
        shouldUpdate = true
      } else {
        this.emit('error', e)
      }
    }
    if (shouldUpdate) {
      // do update
      try {
        let res = await fetch(this.url.href, { timeout: 3000 })
        if (res.status >= 400) {
          if (this.options.fallbackToIndexHTML) {
            if (this.url.pathname[this.url.pathname.length - 1] === '/') {
              this.url.pathname += 'index.html'
            } else {
              this.url.pathname += '/index.html'
            }
            res = await fetch(this.url.href, { timeout: 3000 })
          }
        }
        const buf = await res.arrayBuffer()
        await fs.writeFile(physicalPath, Buffer.from(buf))
        if (hasFatal) {
          try {
            await fs.unlink(fatalPath)
          } catch (e) {
            //
          }
        }
      } catch (e) {
        await fs.writeFile(fatalPath, Buffer.from([]))
        return this.emit('error', e)
      }
    }

    // do read
    const rs = fs.createReadStream(physicalPath)
    rs.on('data', (chunk) => {
      this.push(chunk)
    })
    rs.on('end', () => {
      this.push(null)
    })
    rs.once('error', (e) => this.emit('error', e))
  }

  _read () {
    this.prepare()
  }
}

export default URLCachedStream
