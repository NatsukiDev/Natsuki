const mongooes= require('mongoose');
const UserData = require('../models/user');
const GuildSettings = require('../models/guild');

module.exports = async(message, msg, args, cmd, prefix, mention, client) => {
    let tu = await UserData.findOne({uid: mention.id});
    let tg = message.guild ? await GuildSettings.findOne({gid: message.guild.id}) : null;
    if (tg && tg.nostatus) {return;}
    if (tu) {if (tu.statusmsg.length) {return message.reply(`That user ${tu.statustype === 'dnd' ? 'wishes not to be disturbed' : 'is AFK'}. Reason: ${tu.statusmsg}`);}}
};