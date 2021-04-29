const Monitor = require('../../models/monitor');

module.exports = async client => {
    client.misc.cache.monit = {};
    client.misc.cache.monitEnabled = [];

    for await (const tm of Monitor.find()) {
        client.misc.cache.monit[tm.gid] = {
            messages: tm.messages,
            voice: tm.voice,
            expiry: new Date()
        };
        client.misc.cache.monitEnabled.push(tm.gid);
    }
}