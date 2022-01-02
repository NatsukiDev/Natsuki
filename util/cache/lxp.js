const LXP = require('../../models/localxp');

module.exports = async client => {
    client.misc.cache.lxp.enabled = [];
    client.misc.cache.lxp.disabledChannels = new Map();

    for await (const xp of LXP.find()) {
        client.misc.cache.lxp.enabled.push(xp.gid);
        if (xp.noGains && xp.noGains.length) {client.misc.cache.lxp.disabledChannels.set(xp.gid, xp.noGains);}
    }
};