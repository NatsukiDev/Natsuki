const Discord = require('discord.js');

const Chests = require("../../models/chests");

const ask = require('../../util/ask');

module.exports = {
    name: "chests",
    aliases: ['setupchests', 'enablechests', 'togglechests', 'tch'],
    meta: {
        category: 'Leveling',
        description: "Enable or disable chests in your server, or set a channel for them to spawn in",
        syntax: '`chests [enable|disable|toggle|channel]`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Chests")
        .setDescription("Enable or disable chests in your server, or set a channel for them to spawn in")
        .addField("Notice", "You must have administrator permissions to edit these settings.")
        .addField("Syntax", "`chests [enable|disable|channel]`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {return message.channel.send("You must have administrator permissions in order to edit these settings.");}
        if (!args.length) {args[0] = 'enable';}
        if (['e', 'enable'].includes(args[0].toLowerCase())) {
            if (client.misc.cache.chests.enabled.includes(message.guild.id)) {return message.channel.send("This server already has chest spawning enabled.")};
            try {
                am = await message.channel.send("Would you like to have me send chests to a specific channel?");
                await am.react('👍');
                await am.react('👎');
            } catch {return message.channel.send(":thinking: hmmm... something went wrong there. I might not have permissions to add reactions to messages, and this could be the issue.");}
            try {
                let rc = am.createReactionCollector({filter: (r, u) => ['👍', '👎'].includes(r.emoji.name) && u.id === message.author.id, max: 1, time: 60000});
                rc.on("collect", async r => {
                    useCh = r.emoji.name === "👍";
                    let chestCh = '';
                    if (useCh) {
                        let chestCh = await ask(message, 'What channel would you like me to send chests to? (Ideally, people should be able to speak in it so they can claim the chests)', 60000, false, true);
                        if (!chestCh) {return;}
                        if (!message.guild.channels.cache.has(chestCh) || !message.guild.channels.cache.has(chestCh.slice(2, chestCh.length - 1))) {return message.channel.send("That doesn't seem to be a channel! Try again?");}
                        if (chestCh.startsWith("<")) {chestCh = chestCh.slice(2, chestCh.length - 1);}
                    }
                    let c = new Chests({gid: message.guild.id, channel: chestCh});
                    c.save();
                    client.misc.cache.chests.enabled.push(message.guild.id);
                    return message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setTitle("Chest Spawning Enabled!")
                        .setThumbnail(message.guild.iconURL({size: 2048}))
                        .setDescription(`Your server now has its chest spawning enabled! Chests will spawn in ${chestCh.length ? `<#${chestCh}>` : 'any channel'}.`)
                        .setColor("c375f0")
                        .setFooter({text: "Natsuki", iconURL: client.user.displayAvatarURL()})
                        .setTimestamp()
                    ]});
                });
                rc.on("end", collected => {if (!collected.size) {return message.channel.send("Looks like you ran out of time! Try again?");}});
            } catch {return message.channel.send("Hmm... there was some error problem thingy that happened when I tried to enable chest spawning for your server. If it keeps not working, then go yell at my devs!");}
        }

        else if (['d', 'disable'].includes(args[0].toLowerCase())) {

        }

        else if (['c', 'ch', 'setchannel', 'setch ', 'sc', 'sch', 'enable'].includes(args[0].toLowerCase())) {

        }

        else {return message.channel.send(`Invalid arg! Syntax: \`${prefix}chests [enable|disable|channel]\``);}
    }
};