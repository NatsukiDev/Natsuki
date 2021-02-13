const AR = require('../../models/ar');

module.exports = async client => {
    client.misc.cache.ar = new Map();

    for await (const ar of AR.find()) {
        client.misc.cache.ar.set(ar.gid, ar.triggers);
    }
};