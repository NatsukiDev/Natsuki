const Discord = require('discord.js');

const LXP = require('../models/localxp');

module.exports = {
    name: "setupleveling",
    aliases: ['setuplvl', 'setlvl', 'setleveling', 'levelingsetup', 'lvlset', 'lvlsetup'],
    meta: {
        category: 'Leveling',
        description: "Setup and enable your server's local leveling!",
        syntax: '`setupleveling`',
        extra: "Requires administrator permissions. Disabled by default.",
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Local Leveling Setup")
        .setDescription("Set up your local leveling system to allow your server's members to progress in ranks, which lets you enable leveling roles and shops *features not available at this time*") //TODO remove the "features not available" as soon as they are available
        .addField("Syntax", "`setupleveling`")
        .addField("Important Notice", "You must be a server administrator in order to use this command. Please know that local leveling systems can cost a great deal of our database storage space when used on larger servers, so please only enable this feature **if you will actually make use of it**, not just for fun."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {return message.channel.send("You must be a **server administrator** in order to use this command.");}
        if (await LXP.findOne({gid: message.guild.id})) {return message.channel.send("Your leveling is already set up!");} //TODO add message to lead to disable cmd when complete
        let am;
        try {
            am = await message.channel.send("Would you like to enable :thumbsup: or disable :thumbsdown: level up messages? (You can specify a set channel for this later.)");
            await am.react('👍');
            await am.react('👎');
        } catch {return message.channel.send(":thinking: hmmm... something went wrong there. I might not have permissions to add reactions to messages, and this could be the issue.");}
        try {
            let rc = am.createReactionCollector((r, u) => ['👍', '👎'].includes(r.emoji.name) && u.id === message.author.id, {max: 1, time: 60000});
            rc.on("collect", async r => {
                let xp = new LXP({gid: message.guild.id});
                xp.msg = r.emoji.name === "👍";
                return message.channel.send(new Discord.MessageEmbed()
                    .setTitle("XP System Enabled!")
                    .setThumbnail(message.guild.iconURL({size: 2048}))
                    .setDescription(`Your server now has its leveling system enabled! If you enabled level up messages, you can set the channel for that using \`${prefix}levelchannel\`.`) //TODO update this with info on how the shiz works
                    .setColor("c375f0")
                    .setFooter("Natsuki", client.user.avatarURL())
                    .setTimestamp()
                );
            });
            rc.on("end", collected => {if (!collected.size) {return message.channel.send("Looks like you ran out of time! Try again?");}});
        } catch {return message.channel.send("Hmm... there was some error problem thingy that happened when I tried to enable XP for your server. If it keeps not working, then go yell at my devs!");}
    }
};