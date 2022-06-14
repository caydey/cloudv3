export default function(bytes) {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
  const BYTE = 1024 // size of a byte
  const DECIMAL_PERCISION = 1 // number of decimal points
  if (bytes >= BYTE) {
    const e = Math.floor(Math.log(bytes) / Math.log(BYTE))
    const humanUnits = bytes / Math.pow(BYTE, e)
    const withUnit = humanUnits.toFixed(DECIMAL_PERCISION) + ' ' + units[e]
    return withUnit
  }
  return bytes + ' ' + units[0];
}