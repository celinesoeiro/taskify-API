import http from 'node:http';

import { json } from './middlewares/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js'

import { readFile } from './streams/import-csv.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow access from localhost
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS'); // Allow only specific methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow only specific headers

  // Handle preflight requests (OPTIONS)
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  const route = routes.find(r => {
    return r.method === method && r.path.test(url)
  })

  if (req.headers['content-type'] === 'multipart/form-data') {
    console.log('aqui')
    await readFile(req, res)
  } else {
    await json(req, res)

    if (route) {
      const routeParams = url.match(route.path)

      const { query, ...params } = routeParams.groups

      req.params = params
      req.query = query ? extractQueryParams(query) : {}

      return route.handler(req, res)
    }

    return res.writeHead(404).end('Not found')
  }
})

server.listen(3333);
