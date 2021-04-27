const Discord = require('discord.js');

const AR = require('../../models/ar');
const GuildData = require('../../models/guild');

const ask = require('../../util/ask');

module.exports = {
    name: "ar",
    aliases: ['autoresponse', 'autoresponses'],
    meta: {
        category: 'Misc',
        description: "Create and edit automatic responses, which lets the bot say stuff when you say something in your server!",
        syntax: '`ar <add|edit|delete|settings|list>`',
        extra: null
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Auto Responses")
        .setDescription("Create and edit automatic responses, which lets the bot say stuff when you say something in your server!")
        .addField("Syntax", "`ar <add|edit|delete|settings|list>`")
        .addField("Notice", "This command is server-only, and requires you to be an administrator or have the staff role."),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!message.guild) {return message.channel.send("You must be in a server in order to use this command.");}
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}ar <add|edit|delete|settings|list>\``);}
        const tg = await GuildData.findOne({gid: message.guild.id});
        if (['a', 'add', 'e', 'edit', 'delete', 'd', 's', 'settings'].includes(args[0].toLowerCase()) && ((!tg || !tg.staffrole || !tg.staffrole.length || !message.member.roles.cache.has(tg.staffrole)) && !message.member.permissions.has("ADMINISTRATOR"))) {return message.channel.send("You must have the staff role or be an administrator in this server in order to edit AR settings.");}

        function sortARs(tar) {
            let t = tar.triggers;
            let ar = tar.ars;
            let s = '';
            for (let i=0;i<t.length;i++) {s+=`\`${i+1}.\` ${t[i]}\n-> ${ar[i]}\n\n`;}
            return s;
        }

        function viewARs(string) {
            return new Discord.MessageEmbed()
                .setTitle("Auto-Responses in this Server")
                .setDescription(string)
                .setColor('c375f0')
                .setFooter("Natsuki", client.user.avatarURL())
                .setTimestamp();
        }

        if (['a', 'add'].includes(args[0].toLowerCase())) {
            let trigger = await ask(message, "What would you like the trigger to be? This is the message that will make your AR work.", 120000); if (!trigger) {return;}
            if (`${trigger}`.length > 150) {return message.channel.send("Your trigger needs to be less than 150 characters, please!");}
            let response = await ask(message, "What would you like my response to be?", 120000); if (!response) {return;}
            if (`${response}`.length > 300) {return message.channel.send("Your response needs to be less than 300 characters, please!");}

            let tar = await AR.findOne({gid: message.guild.id}) || new AR({gid: message.guild.id});
            if (tar.triggers.length === 20) {return message.channel.send("Because of data storage concerns, your ARs are capped at 20 per server. You can join the official support server and talk to the devs if you have a legitimate reason for raising this limit and they can see about raising it for you!");}
            let h = false; let ar; for (ar of tar.triggers) {if (ar && ar.toLowerCase() === `${trigger}`.toLowerCase()) {h = true;}}
            if (h) {return message.channel.send("You seem to already have that trigger. Try using `edit` instead!");}
            tar.triggers.push(trigger.toLowerCase());
            client.misc.cache.ar.set(message.guild.id, tar.triggers);
            tar.ars.push(response);
            tar.save();
            return message.channel.send("AR added!");
        }

        if (['e', 'edit'].includes(args[0].toLowerCase())) {
            let tar = await AR.findOne({gid: message.guild.id});
            if (!tar || !tar.triggers.length) {return message.channel.send("You can't edit any auto-responses... because there aren't any here...");}

            let sar = sortARs(tar);
            await message.channel.send(viewARs(sar).addField("Editing", "Please say the **number** of the AR you wish to edit."));
            let collected;
            try {collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, {errors: ['time'], time: 60001, max: 1});}
            catch {return message.channel.send("This question has timed out. Please try again!");}
            collected = collected.first().content.trim();
            if (isNaN(Number(collected))) {return message.channel.send("Hmmm, maybe try replying with a *number*!");}
            let id = Number(collected);
            if (id < 1 || id > tar.triggers.length) {return message.channel.send("Your number was either below 1 or doesn't have a trigger to match it.");}
            try {
                let response = await ask(message, "What would you like the new response to be?", 120000); if (!response) {return;}
                if (`${response}`.length > 300) {return message.channel.send("Your response needs to be less than 300 characters, please!");}
                let tarars = tar.ars;
                tarars[id-1] = response;
                tar.ars = tarars;
                tar.markModified('ars');
                tar.save();
                return message.channel.send("Yeah, that response seems to fit better than the last one.");
            } catch {return message.channel.send("There seemed to have been a problem deleting that AR. Contact my devs if the problem persists.");}
        }

        if (['d', 'delete'].includes(args[0].toLowerCase())) {
            let tar = await AR.findOne({gid: message.guild.id});
            if (!tar || !tar.triggers.length) {return message.channel.send("It's not like this server has any ARs for me to delete in the first place!");}

            let sar = sortARs(tar);
            await message.channel.send(viewARs(sar).addField("Deletion", "Please say the **number** of the AR you wish to delete."));
            let collected;
            try {collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, {errors: ['time'], time: 60000, max: 1});}
            catch {return message.channel.send("This question has timed out. Please try again!");}
            collected = collected.first().content.trim();
            if (isNaN(Number(collected))) {return message.channel.send("You didn't reply with a number!");}
            let id = Number(collected);
            if (id < 1 || id > tar.triggers.length) {return message.channel.send("Your number was either below 1 or doesn't have a trigger to match it.");}
            try {
                let temptt = tar.triggers;
                temptt.splice(id-1, 1);
                let tempar = tar.ars;
                tempar.splice(id-1, 1);
                tar.triggers = temptt; tar.ars = tempar;
                tar.markModified('triggers'); tar.markModified('ars');
                tar.save();
                client.misc.cache.ar.set(message.guild.id, tar.triggers);
                return message.channel.send("I didn't like saying that anyway.");
            } catch {return message.channel.send("There seemed to have been a problem deleting that AR. Contact my devs if the problem persists.");}
        }

        if (['v', 'view', 'l', 'list'].includes(args[0].toLowerCase())) {
            let tar = await AR.findOne({gid: message.guild.id});
            if (!tar || !tar.triggers.length) {return message.channel.send("This server has no ARs!");}
            return message.channel.send(viewARs(sortARs(tar)));
        }

        if (['s', 'settings'].includes(args[0].toLowerCase())) {
            args.shift();
            if (!args.length) {return message.reply("You can `view` your server's AR settings or `ignore` a channel");}

            let tar = await AR.findOne({gid: message.guild.id});
            if (!tar || !tar.triggers.length) {return message.channel.send("This server doesn't have any auto-responses, so changing or viewing the settings would be pointless...");}

            if (['v', 'view'].includes(args[0].toLowerCase())) {
                if (!tar.ignoreChs.length) {return message.channel.send("This server doesn't have any channels set to be ignored for ARs.");}
                let s = '';
                let c; for (c of tar.ignoreChs) {s += `<#${c}>, `}
                return message.channel.send(`Channels I won't do auto-responses in: ${s.slice(0, s.length - 2)}`);
            }

            if (['i', 'ignore'].includes(args[0].toLowerCase())) {
                let ch;
                if (args[1]) {
                    ch = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
                    if (!ch) {return message.channel.send("I couldn't find that channel. Please try again!");}
                } else {ch = message.channel;}
                ch = ch.id;
                if (tar.ignoreChs.includes(ch)) {
                    let ti = tar.ignoreChs;
                    ti.splice(ti.indexOf(ch), 1);
                    tar.ignoreChs = ti;
                    tar.markModified('ignoreChs');
                    tar.save();
                    client.misc.cache.arIgnore.set(message.guild.id, tar.ignoreChs);
                    return message.channel.send("I'll start replying to Auto Responses in this channel from now on.");
                } else {
                    tar.ignoreChs.push(ch);
                    tar.save();
                    client.misc.cache.arIgnore.set(message.guild.id, tar.ignoreChs);
                    return message.channel.send("Got it. I'll ignore Auto Responses here from now on.");
                }
            }
        }

        return message.channel.send(`That's not a valid argument! Try \`${prefix}help ar\``);
    }
};