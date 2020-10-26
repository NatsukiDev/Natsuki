const GuildData = require('../models/guild');

module.exports = async (client, member) => {
    let tg = await GuildData.findOne({gid: member.guild.id});
    if (tg && tg.joinrole.length && member.guild.roles.cache.has(tg.joinrole)) {
        if (member.guild.members.cache.get(client.user.id).permissions.has("MANAGE_ROLES")) {member.roles.add(tg.joinrole);}
    }
};