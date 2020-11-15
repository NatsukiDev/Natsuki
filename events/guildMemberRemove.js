const GuildData = require('../models/guild');
const Responses = require('../models/responses');
const sendResponse = require('../util/response/sendresponse');

module.exports = async (client, member) => {
    let tg = await GuildData.findOne({gid: member.guild.id});
    let tr = await Responses.findOne({gid: member.guild.id});
    if (
        tr && tr.bindings.has('leave') && tr.responses.has(tr.bindings.get('leave'))
        && tg.lch.length && member.guild.channels.cache.has(tg.lch)
        && member.guild.channels.cache.get(tg.lch).permissionsFor(client.user.id).has("SEND_MESSAGES")
        && !client.users.cache.get(member.id).bot
    ) {
        try {member.guild.channels.cache.get(tg.lch).send(await sendResponse(member, member.guild.channels.cache.get(tg.lch), 'xdlol', client, tr.responses.get(tr.bindings.get('leave'))));} catch {}
    }
};