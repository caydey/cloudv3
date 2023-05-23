export default function (children, search) {
  const matches = [];
  // dont match everything if no search provided
  if (search === "") {
    return matches;
  }

  for (let i = 0; i < children.length; i++) {
    if (children[i].name.toUpperCase().includes(search.toUpperCase())) {
      matches.push(children[i]);
    }
  }
  return matches;
}
