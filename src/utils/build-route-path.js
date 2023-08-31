export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  // ?<$1> is used to get the name of the parameters in a automatic way
  const pathWithParameters = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParameters}`)

  return pathRegex
}
