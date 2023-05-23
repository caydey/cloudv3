export default function (children, search) {
  const matches = [];
  // dont match everything if no search provided
  if (search === "") {
    return matches;
  }
  search = search.toUpperCase();
  for (let i = 0; i < children.length; i++) {
    const filename = children[i].name.toUpperCase();
    if (
      (search.length <= 3 && filename.startsWith(search)) || // less than 3, startsWith
      (search.length > 3 && filename.includes(search)) // greater than 3, includes
    ) {
      matches.push(children[i]);
    }
  }
  return matches;
}
