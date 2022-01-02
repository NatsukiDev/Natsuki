const Chests = require('../../models/chests');

module.exports = async client => {
    client.misc.cache.chests = [];

    for await (const chest of Chests.find()) {
        client.misc.cache.chests.push(chest.gid);
    }
};