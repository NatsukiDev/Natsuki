const Monitors = require('../models/monitor');

module.exports = async (client) => {
    let cd = new Date().getTime();
    Object.keys(client.misc.cache.monit).forEach(cache => {
        Monitors.findOne({gid: cache}).then(tm => {
            if (!tm) {return;}
            tm.messages = client.misc.cache.monit[cache].messages;
            tm.markModified(`messages.total`);
            Object.keys(client.misc.cache.monit[cache].messages.members).forEach(m => tm.markModified(`messages.members.${m}`));
            Object.keys(client.misc.cache.monit[cache].messages.channels).forEach(c => tm.markModified(`messages.channels.${c}`));
            tm.voice = client.misc.cache.monit[cache].voice;
            tm.markModified(`voice.total`);
            Object.keys(client.misc.cache.monit[cache].voice.members).forEach(m => tm.markModified(`voice.members.${m}`));
            Object.keys(client.misc.cache.monit[cache].voice.channels).forEach(c => tm.markModified(`voice.channels.${c}`));
            tm.save();
            if (cd > client.misc.cache.monit[cache].expiry.getTime()) {delete client.misc.cache.monit[cache];}
        });
    });
};