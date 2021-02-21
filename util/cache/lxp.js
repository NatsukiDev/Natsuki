const LXP = require('../../models/localxp');

module.exports = async client => {
    client.misc.cache.lxp.enabled = [];

    for await (const xp of LXP.find()) {
        client.misc.cache.lxp.enabled.push(xp.gid);
    }
};