const Responses = require('../../models/responses');

module.exports = async (message, name) => {
    let tr = await Responses.findOne({gid: message.guild.id});
    if (!tr) {message.reply("This server does not have any responses saved!"); return null;}
    if (!tr.responses.has(name.toLowerCase())) {message.reply("I don't have that response saved here."); return null;}
    if (message.guild.me.permissions.has("DELETE_MESSAGES")) {message.delete();}
    return tr.responses.get(name.toLowerCase());
};