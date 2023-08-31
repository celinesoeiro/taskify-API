import http from 'node:http';

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  console.log(method, url)
})

server.listen(3333);
