const Api = {
  get: async url => {
    let res;
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        res = data;
      })
      .catch(err => {
        console.log(err);
        res = err;
      });
    return res;
  },
  getText: async url => {
    let res;
    await fetch(url)
      .then(response => response.text())
      .then(data => {
        res = data;
      })
      .catch(err => {
        console.log(err);
        res = err;
      });
    return res;
  }
};
export default Api;
