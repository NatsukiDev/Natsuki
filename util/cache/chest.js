const Chests = require('../../models/chests');

module.exports = async client => {
    client.misc.cache.chests.enabled = [];

    for await (const chest of Chests.find()) {
        client.misc.cache.chests.enabled.push(chest.gid);
    }
};