const Responses = require('../../models/responses');

module.exports = async (options, message) => {
    try {
        if (!options) {return null;}
        if (!options.name || !options.name.length) {message.reply("You need to have a name in order to save a response."); return null;}
        let sr = await Responses.findOne({gid: message.guild.id}) ? await Responses.findOne({gid: message.guild.id}) : new Responses({gid: message.guild.id});
        if (sr.responses.has(options.name)) {message.reply("You already have a response with that name. Use `edit` instead."); return null;}
        sr.responses.set(options.name, options);
        sr.save();
        message.channel.send("Response added!");
    } catch {message.reply("There seems to have been an error in saving your response. If this persists, please contact the developers or join the support sever."); return null;}

    return options;
};