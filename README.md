# URL-Cached

Load and cache content from any url address.

---

## Install

```sh
yarn add url-cached # npm i url-cached
```

## Usage

```js
import UrlCached from 'url-cached'

const urlcached = UrlCached({
  cacheDir?: string | '~/.url-cached'
  reload?: boolean | false // true means all old file will be download again
  expire?: number | 0 // 0 means no expire, only download onece
  retryInterval?: number | 0 // 0 means no retry, fatal will not download again
})

// read(url: string, encoding: string): Promise<string>
await urlcached.read('https://unpkg.com/deno_testing@0.0.5/testing.ts')


// createReadStream(url: string): Readable
urlcached.createReadStream('https://unpkg.com/deno_testing@0.0.5/testing.ts')

```

If url protocol is `file:`, urlencode will just read and return file content.

## License 

[MIT License](LICENSE)