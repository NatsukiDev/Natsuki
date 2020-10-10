const mongooes= require('mongoose');
const UserData = require('../models/user');

module.exports = async(message, msg, args, cmd, prefix, mention, client) => {
    let tu = await UserData.findOne({uid: mention.id});
    if (tu) {if (tu.statusmsg.length) {return message.reply(`That user ${tu.statustype === 'dnd' ? 'wishes not to be disturbed' : 'is AFK'}. Reason: ${tu.statusmsg}`);}}
};