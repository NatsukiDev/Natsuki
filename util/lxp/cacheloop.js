const LXP = require('../../models/localxp');
const Monners = require('../../models/monners');

module.exports = async (client) => {
    let cd = new Date().getTime();
    await Object.keys(client.misc.cache.lxp.xp).forEach(gxp => {
        LXP.findOne({gid: gxp}).then(xp => {
            if (!xp) {return;}
            Object.keys(client.misc.cache.lxp.xp[gxp]).forEach(user => {
                xp.xp[user] = [client.misc.cache.lxp.xp[gxp][user].xp, client.misc.cache.lxp.xp[gxp][user].level];
                xp.markModified(`xp.${user}`);
                if (cd - client.misc.cache.lxp.xp[gxp][user].lastXP > 600000) {
                    delete client.misc.cache.lxp.xp[gxp][user];
                    if (!Object.keys(client.misc.cache.lxp.xp[gxp]).length) {delete client.misc.cache.lxp.xp[gxp];}
                }
            });
            xp.save().catch(() => {});
        });

        Object.keys(client.misc.cache.monners).forEach(user => {
            Monners.findOne({uid: user}).then(m => {
                if (!Object.keys(client.misc.cache.monners).includes(user)) {return;}
                if (isNaN(client.misc.cache.monners[user])) {return;}
                if (!m) {m = new Monners({uid: user});}
                m.currency = client.misc.cache.monners[user];
                m.save().catch(() => {});
                if (cd - client.misc.cache.lastMonners[user] > 600000) {
                    delete client.misc.cache.monners[user];
                    delete client.misc.cache.lastMonners[user];
                }
            });
        })
    });
};