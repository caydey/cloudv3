export default function(file) {
  // string to be hashed
  const string = file.path+file.name+file.size;
  
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    let chr = string.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  
  hash = Math.abs(hash)
  const hex = hash.toString(36); // (26: abc) + (10: 123)
  return hex
}