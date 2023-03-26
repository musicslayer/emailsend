const fs = require("fs");

const secretsMap = createSecretsMap();

function createSecretsMap() {
    let json = fs.readFileSync("secrets/secrets.json");
    let map = new Map(Object.entries(JSON.parse(json)));

    map.set("ssl_key", fs.readFileSync("secrets/ssl/_.musicslayer.com.key"));
    map.set("ssl_cert", fs.readFileSync("secrets/ssl/_.musicslayer.com.crt"));

    map.set("dkim_private_key", fs.readFileSync("secrets/dkim/musicslayer.key"));
    map.set("dkim_key_selector", fs.readFileSync("secrets/dkim/musicslayer.selector"));

    return map;
}

function getSecret(key) {
    return secretsMap.get(key);
}

module.exports.getSecret = getSecret;