import fs from 'fs'
import os from 'os'
import path from 'path'
import mkdirp from 'mkdirp'
import streamToBuffer from './streamToBuffer'
import URLCachedStream from './UrlCachedStream'

const homedir = os.homedir()

class UrlCached {
  constructor (options = {}) {
    if (!options.cacheDir) options.cacheDir = path.resolve(homedir, './.url-cached')
    if (typeof options.reload === 'undefined') options.reload = false
    if (typeof options.expire === 'undefined') options.expire = 0
    if (typeof options.retryInterval === 'undefined') options.retryInterval = 30000
    if (typeof options.preferCache === 'undefined') options.preferCache = false
    this.options = options
    this.options.ctime = Date.now()
    mkdirp.sync(options.cacheDir)
  }

  read = async (dirtyURL, encoding) => {
    const result = await streamToBuffer(this.createReadStream(dirtyURL))
    if (!encoding) return result
    return result.toString(encoding)
  }

  createReadStream = (dirtyURL) => {
    const url = new URL(dirtyURL)
    if (url.protocol === 'file:') {
      return fs.createReadStream(url)
    }
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return new URLCachedStream(url, {
        preferCache: this.options.preferCache,
        cacheDir: this.options.cacheDir,
        expire: this.options.expire,
        ctime: this.options.ctime,
        reload: this.options.reload,
        retryInterval: this.options.retryInterval,
        fallbackToIndexHTML: this.options.fallbackToIndexHTML
      })
    }
    throw new Error(`Protocol [${url.protocol}] is not supported.`)
  }
}

export default UrlCached
