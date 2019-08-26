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
  },
  post: async (url, body) => {
    let res;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        res = data;
      })
      .catch(err => {
        res = `Error in ${url} post method`;
        console.log(res);
      });
    return res;
  }
};
export default Api;
