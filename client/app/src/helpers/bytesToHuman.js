export default function(bytes) {
  const units = ['', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes >= 1024) {
    let e = Math.floor(Math.log(bytes) / Math.log(1024));
    let human = (bytes / Math.pow(1024, e)).toFixed(1) + ' ' + units[e];

    return human;    
  }
  return bytes;
}