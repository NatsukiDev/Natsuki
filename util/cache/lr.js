const LR = require('../../models/levelroles');

module.exports = async client => {
    client.misc.cache.lxp.hasLevelRoles = [];

    for await (const lr of LR.find()) {
        client.misc.cache.lxp.hasLevelRoles.push(lr.gid);
    }
};