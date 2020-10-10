const Discord = require('discord.js');
const GuildSettings = require('../util/guild');

module.exports = {
    name: "prefix",
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Prefix")
        .setDescription("Changes your server's prefix.")
        .addField("Syntax", "`prefix <newPrefix|clear>`")
        .addField("Staff Command", "This command requires you to either be admin, or to have the designated staff role.")
        .addField("Notice", "Prefixes are cached, and may take up to a minute to update."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply("This is a guild-only command!");}
        let tguild = await GuildSettings.findOne({gid: message.guild.id})
            ? await GuildSettings.findOne({gid: message.guild.id})
            : new GuildSettings({gid: message.guild.id});
        if (!message.member.permissions.has("ADMINISTRATOR") && (!tguild.staffrole.length || !message.guild.roles.cache.has(tguild.staffrole) || !message.member.roles.cache.has(tguild.staffrole))) {return message.reply("You don't have the permissions to use this command here.");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix} <newPrefix|clear>\`. My current prefix in this server is \`${tguild.prefix.length ? tguild.prefix : 'n?'}\``);}
        let np = args[0];
        if (np.length > 7) {return message.reply("Hmmm, that prefix is a bit long. Try making something smaller!");}
        if (!np.match(/^[a-zA-Z0-9,.!?<>\-_+=/;$#%^&*]$/m)) {return message.reply('Your custom prefix contains some *wonky* characters. Please use only alphanumerics and basic symbols.');}
        tguild.prefix = ['c', 'clear', 'n', 'none'].includes(np.trim().toLowerCase()) ? '' : np;
        tguild.save();
        let upm = message.reply("sure thing!");
        await require('../util/wait')(1750);
        return upm.edit(new Discord.MessageEmbed()
            .setAuthor('Prefix updated!', message.author.avatarURL())
            .setDescription(`New prefix: \`${np}\``)
            .addField('Auditing Admin', `<@${message.member.id}>`, true)
            .addField("Notice", "Prefixes are cached, and may take up to a minute to update.")
            .setColor('c375f0')
            .setFooter('Natsuki', client.user.avatarURL())
            .setTimestamp()
        );
    }
};