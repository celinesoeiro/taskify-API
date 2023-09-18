export async function json(req, res) {
  const buffers = []

  for await (const chunk of req) {
    console.log({chunk})
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }
}
