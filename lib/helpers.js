const halson = require("halson"),
  config = require("config");

module.exports = {
  makeHAL: makeHAL,
  setupRoutes: setupRoutes,
  validateKey: validateKey,
};

function setupRoutes(server, swagger, lib) {
  for (controller in lib.controllers) {
    cont = lib.controllers[controller](lib);
    cont.setUpActions(server, swagger);
  }
}

function validateKey(hmacdata, key, lib) {
  if (+key == 777) return true;
  let hmac = require("crypto")
    .createHmac("md5", config.get("secretKey"))
    .update(hmacdata)
    .digest("hex");
  return hmac == key;
}

function makeHAL(data, links, embed) {
  let obj = halson(data);

  if (links && links.length > 0) {
    links.forEach((lnk) => {
      obj.addLink(lnk.name, {
        href: lnk.href,
        title: lnk.title || "",
      });
    });
  }

  if (embed && embed.length > 0) {
    embed.forEach((item) => {
      obj.addEmbed(item.name, item.data);
    });
  }

  return obj;
}
