// Type definitions for url-cached
// Project: url-cached
// Definitions by: heineiuo <https://github.com/heineiuo>

import { Readable } from "stream";

interface UrlCachedOptions {
  preferCache?: boolean | false; // use cache even expired
  cacheDir?: string | "~/.url-cached";
  reload?: boolean | false; // true means all old file will be download again
  expire?: number | 0; // 0 means no expire, only download onece
  retryInterval?: number | 0; // 0 means no retry, fatal will not download again
  fallbackToIndexHTML?: boolean; // default false; if true, will try to fetch ${ORIGINAL_PATH}/index.html
}

interface UrlCached {
  read(url: string, encoding: string): Promise<string>;
  createReadStream(url: string): Readable;
}

export default function(options: UrlCachedOptions): UrlCached;
