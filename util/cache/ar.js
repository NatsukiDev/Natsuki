const AR = require('../../models/ar');

module.exports = async client => {
    client.misc.cache.ar = new Map();
    client.misc.cache.arIgnore = new Map();

    for await (const ar of AR.find()) {
        client.misc.cache.ar.set(ar.gid, ar.triggers);
        if (ar.ignoreChs.length) {client.misc.cache.arIgnore.set(ar.gid, ar.ignoreChs);}
    }
};