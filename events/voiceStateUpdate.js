const Monitor = require('../models/monitor');

module.exports = async (client, oldState, voice) => {
    if (client.users.cache.get(voice.member.id).bot) {return;}
    if (voice.guild && client.misc.cache.monitEnabled.includes(voice.guild.id)) {
        if (voice.channelID) {
            client.misc.cache.VCG[voice.member.id] = voice.guild.id;
            if (!client.misc.cache.inVC.includes(voice.member.id)) {client.misc.cache.inVC.push(voice.member.id);}
            if (!client.misc.cache.activeVC.includes(voice.channelID)) {client.misc.cache.activeVC.push(voice.channelID);}
        } else {
            if (!client.misc.cache.inVC.includes(voice.member.id)) {return;}
            client.misc.cache.inVC.splice(client.misc.cache.inVC.indexOf(voice.member.id), 1);
            if (!voice.channel.members.size && client.misc.cache.activeVC.includes(voice.channelID)) {client.misc.cache.activeVC.splice(client.misc.cache.activeVC.indexOf(voice.channelID), 1);}
            if (Object.keys(client.misc.cache.VCG).includes(voice.member.id)) {delete client.misc.cache.VCG[voice.member.id];}
        }
    }
};