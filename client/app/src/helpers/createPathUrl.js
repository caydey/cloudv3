import { EXPLORE_ROUTE_NAME } from '../config';

export default function(path) {
  // encode everything except '/'
  let encodedPath = encodeURIComponent(path).replaceAll('%2F', '/')

  // create url '192.168.0.2/explore/my%20path/has%20%23spaces
  const pathUrl = '/' + EXPLORE_ROUTE_NAME + encodedPath

  return pathUrl
}