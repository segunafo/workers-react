const fs = require("fs");
const util = require("util");
const fetch = require("node-fetch");
const readFile = util.promisify(fs.readFile);
const config = require("../webpack.config");

async function deploy(script) {
  let resp = await fetch(
    "https://api.cloudflare.com/client/v4/accounts" +
      node.env.CLOUDFLARE_ZONE +
      "/workers/scripts/" +
      node.env.CLOUDFLARE_SCRIPT,
    {
      method: "PUT",
      headers: {
        "cache-control": "no-cache",
        "content-type": "text/javascript",
        "X-Auth-Email": node.env.CLOUDFLARE_EMAIL,
        "X-Auth-Key": node.env.CLOUDFLARE_KEY
      },
      body: script
    }
  );

  let data = await resp.json();
  return data;
}

readFile(config.output.publicPath + "/" + config.output.filename, "utf8").then(
  data => {
    deploy(data).then(d => {
      console.log(d.errors);
    });
  }
);
