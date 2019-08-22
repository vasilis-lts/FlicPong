export async function get(url) {
  let res;
  await fetch(url)
    .then(results => results.json())
    .then(data => {
      res = data;
    })
    .catch(err => {
      console.log(err);
      res = err;
    });
  return res;
}

export function getPlayers() {
  const players = ["Bill", "Dennis", "Stevy", "Thomas"];
  return players;
}
