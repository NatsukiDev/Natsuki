const Discord = require("discord.js");

module.exports = {
    name: "vip",
    aliases: ["premium"],
    help: new Discord.MessageEmbed()
    .setTitle("Help -> VIP")
    .setDescription("Toggle a server as VIP. This grants a few small bonuses to your server that you can't get anywhere else!\n\nWant to become a VIP? Support the bot by [joining the support server](), donating to the bot's creators, or promoting/spreading the bot to other servers.")
    .addField("Syntax", "`vip <add|remove|check>`")
    .addField("Notice", "This command is **developer-only**."),
    meta: {
        category: 'Developer',
        description: "Set server VIP status",
        syntax: '`vip <add|remove|check>`',
        extra: "This command is mostly cosmetic as there are no real perks *yet*"
    },
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.reply("This command is server-only!");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}vip <add|remove|check>\``);}
        if (!client.developers.includes(message.author.id) && !['check', 'c', 'view', 'v'].includes(args[0])) {return message.reply("Unfortunately, this is a **developer-only command**!");}
        const GuildSettings = require('../../models/guild');
        const logemb = (act) => new Discord.MessageEmbed()
        .setAuthor({name: `VIP Server ${act}`, iconURL: message.author.avatarURL()})
        .setDescription("A Server's VIP status was updated.")
        .setThumbnail(message.guild.iconURL({size: 1024}))
        .addField("Name", message.guild.name, true)
        .addField("Admin", message.author.username, true)
        .setColor("e8da3a")
        .setFooter({text: "Natsuki"})
        .setTimestamp();

        if (['add', 'a', 'make', 'm'].includes(args[0])) {
            let tguild = await GuildSettings.findOne({gid: message.guild.id})
                ? await GuildSettings.findOne({gid: message.guild.id})
                : new GuildSettings({gid: message.guild.id});
            if (tguild.vip === true) {return message.reply("This server is already a VIP server.");}
            tguild.vip = true;
            tguild.save();
            client.guilds.cache.get('762707532417335296').channels.cache.get('762732961753595915').send({embeds: [logemb("Added")]});
            return message.reply("This server is now a VIP server!");
        } else if (['remove', 'r', 'delete', 'd'].includes(args[0])) {
            let tguild = await GuildSettings.findOne({gid: message.guild.id});
            if (tguild) {
                if (tguild.vip === false) {return message.reply("This server wasn't a VIP server anyways...");}
                await GuildSettings.findOneAndUpdate({gid: message.guild.id, vip: false});
                client.guilds.cache.get('762707532417335296').channels.cache.get('762732961753595915').send({embeds: [logemb("Removed")]});
            } else {return message.reply("This server wasn't a VIP server anyways...");}
            return message.reply("This server is no longer a VIP server!");
        } else if (['check', 'c', 'view', 'v'].includes(args[0])) {
            let tguild = await GuildSettings.findOne({gid: message.guild.id});
            return message.reply((tguild && tguild.vip) ? 'This server is a VIP server.' : 'This server is not a VIP server.');
        }
    }
};