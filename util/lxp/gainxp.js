const LXP = require('../../models/localxp');
const LR = require('../../models/levelroles');

module.exports = async (client, member, channel) => {
    client.misc.cache.lxp.xp[channel.guild.id][member].lastXP = new Date().getTime();
    client.misc.cache.lxp.xp[channel.guild.id][member].xp += 10;

    let x = client.misc.cache.lxp.xp[channel.guild.id][member].level;
    let max = Math.ceil(100 + (((x / 3) ** 2) * 2));

    if (client.misc.cache.lxp.xp[channel.guild.id][member].xp > max) {
        client.misc.cache.lxp.xp[channel.guild.id][member].xp -= max;
        client.misc.cache.lxp.xp[channel.guild.id][member].level += 1;

        LXP.findOne({gid: channel.guild.id}).then(async xp => {
            if (!xp || !xp.msg) {return;}
            try {
                let ch = xp.lvch.length ? channel.guild.channels.cache.get(xp.lvch) : channel;
                if (ch.partial) {await ch.fetch().catch(() => {});}
                if (ch && ch.permissionsFor(ch.guild.me.id).has('SEND_MESSAGES')) {ch.send(`<:awoo:560193779764559896> <@${member}> has reached **Level ${x + 1}**!`).catch((e) => {/*console.error(e)*/});}
                if (client.misc.cache.lxp.hasLevelRoles.includes(channel.guild.id)) {
                    LR.findOne({gid: channel.guild.id}).then(async lr => {
                        if (!lr) {return;}
                        if (Object.keys(lr.roles).includes(`${client.misc.cache.lxp.xp[channel.guild.id][member].level}`)) {
                            try {
                                let role = channel.guild.roles.cache.get(`${lr.roles[client.misc.cache.lxp.xp[channel.guild.id][member].level]}`);
                                if (!role) {return;}
                                if (!channel.guild.me.permissions.has("MANAGE_ROLES")) {return;}
                                let m = channel.guild.members.cache.get(member);
                                if (!m) {return;}
                                m.roles.add(role).catch((e) => {/*console.error(e);*/});
                            } catch (e) {/*console.error(e);*/}
                        }
                    });
                }
            } catch (e) {/*console.error(e);*/}
        }).catch((e) => {/*console.error(e);*/})
    }
};