const Discord = require('discord.js');
const moment = require('moment');

const UserData = require('../models/user');
const GuildSettings = require('../models/guild');

module.exports = async(message, msg, args, cmd, prefix, mention, client) => {
    let tu = await UserData.findOne({uid: mention.id});
    let tg = message.guild ? await GuildSettings.findOne({gid: message.guild.id}) : null;
    if (tg && tg.nostatus) {return;}
    if (client.misc.statusPings.has(message.guild.id) && client.misc.statusPings.get(message.guild.id).has(mention.id) && new Date().getTime() - client.misc.statusPings.get(message.guild.id).get(mention.id).getTime() < 300000) {return;}
    if (tu && tu.statusmsg.length) {
        if (!client.misc.statusPings.has(message.guild.id)) {client.misc.statusPings.set(message.guild.id, new Discord.Collection());}
        client.misc.statusPings.get(message.guild.id).set(mention.id, new Date());
        let m = await message.channel.send(`That user ${tu.statustype === 'dnd' ? 'wishes not to be disturbed' : 'is AFK'}. Reason: ${tu.statusmsg}.${tu.statussetat ? ` \`(This status was set ${moment(tu.statussetat.getTime()).fromNow()})\`` : ''}`);
        await require('../util/wait')(10000);
        m.delete().catch((e) => {console.log(e);});
        //console.log(m);
    }
};