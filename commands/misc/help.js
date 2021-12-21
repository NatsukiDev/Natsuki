const Discord = require("discord.js");

const {Pagination} = require('../../util/pagination');
const ask = require('../../util/ask');

module.exports = {
    name: "help",
    aliases: ["h", "commands"],
    help: 'you silly! What did you expect me to respond with?',
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {
            let sorted = {};
            await Array.from(client.commands.values()).forEach(command => {if (command.name !== "help" && command.meta) {
                sorted[command.meta.category] = sorted[command.meta.category] ? sorted[command.meta.category] : {};
                sorted[command.meta.category][command.name] = command;
            }});
            let helpSorted = {};
            let category; for (category of Object.keys(sorted)) {
                let categorySorted = [];
                let current = 1;
                let currentEmbed = new Discord.MessageEmbed().setAuthor("Help Menu", message.author.avatarURL()).setTitle(category).setDescription("React to control the menu! You can also specify a command name when doing the help command to get more info about it.").setColor("c375f0");
                let commands = Object.keys(sorted[category]);
                let command; for (command of commands) {
                    let aliases = '';
                    let a; if (sorted[category][command].aliases) {for (a of sorted[category][command].aliases) {aliases += `\`${a}\`, `}}
                    aliases = aliases.length ? aliases.slice(0, aliases.length - 2) : 'None';
                    currentEmbed.addField(`${command.slice(0,1).toUpperCase()}${command.slice(1)}`, `${sorted[category][command].meta.description}\n\nAliases: ${aliases}\nSyntax: ${sorted[category][command].meta.syntax}${sorted[category][command].meta.extra ? '\n\n' + sorted[category][command].meta.extra : ''}`);
                    current += 1;
                    if (current === 5) {
                        categorySorted.push(currentEmbed);
                        current = 1;
                        currentEmbed = new Discord.MessageEmbed().setAuthor("Help Menu", message.author.avatarURL()).setTitle(category).setDescription("React to control the menu! You can also specify a command name when doing the help command to get more info about it.").setColor("c375f0");
                    }
                }
                if (current > 1) {categorySorted.push(currentEmbed);}
                helpSorted[category] = categorySorted;
            }

            let cle = await message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Natsuki Help")
                    .setDescription(`Here you can find a list of commands and how to use them.\n\nNatsuki's prefix, by default, is \`n?\`. Here, it's \`${prefix}\`.\n\nWhen viewing a command's syntax, a parameter/argument marked with <> means that it is required. [] shows that it is optional.\n\nGet more help on a command by sending it without any arguments (i.e. \`${prefix}anime\`), or run \`${prefix}help <command>\`.`)
                    .addField("Category", "What category would you like to view?\n:one: - Fun\n:two: - Utility\n:three: - Misc\n:four: - Developer\n:five: - Moderation\n:six: - Social\n:seven: - Leveling\n:eight: - Anime\n:nine: - **All**")
                    .setColor('c375f0')
                    .setFooter("Natsuki | Will time out in 60 seconds.")
                    .setThumbnail(client.user.avatarURL({size: 2048}))
                    .setTimestamp()
            ]});

            let pages;
            let nums = {
                '1️⃣': "Fun",
                '2️⃣': "Utility",
                '3️⃣': "Misc",
                '4️⃣': "Developer",
                '5️⃣': "Moderation",
                '6️⃣': "Social",
                '7️⃣': "Leveling",
                '8️⃣': "Anime",
                '9️⃣': "All"
            };
            Object.keys(nums).forEach(num => cle.react(num).catch(() => {}));
            let donePre = false;

            const getCat = () => {
                return new Promise(r => {
                    message.channel.awaitMessages({filter: m => m.author.id === message.author.id, max: 1, errors: ['time'], time: 60000}).then(cat => {
                        if (donePre) {return;}
                        cat = cat.first().content;
                        if (['f', 'fun', 'u', 'util', 'utility', 'utilities', 'm', 'misc', 'miscellaneous', 'mod', 'moderation', 's', 'social', 'leveling', 'l', 'level', 'ani', 'anime', 'a', 'all'].includes(`${cat}`.trim().toLowerCase())) {
                            if (['f', 'fun'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Fun'];}
                            if (['u', 'util', 'utility', 'utilities'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Utility'];}
                            if (['m', 'misc', 'miscellaneous'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Misc'];}
                            if (['d', 'dev', 'developer'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Developer'];}
                            if (['mod', 'moderation'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Moderation'];}
                            if (['s', 'social'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Social'];}
                            if (['l', 'leveling', 'level'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Leveling'];}
                            if (['ani', 'anime'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Anime'];}
                            if (['a', 'all'].includes(`${cat}`.trim().toLowerCase())) {pages = []; let c; for (c of Object.values(helpSorted)) {let h; for (h of c) {pages.push(h)}}}
                            donePre = true;
                            r(true);
                        } else {donePre = true; r(false);}
                    }).catch(() => {donePre = true; r(false);});

                    cle.awaitReactions({filter: (rt, u) => Object.keys(nums).includes(rt.emoji.name) && u.id === message.author.id, time: 60000, errors: ['time'], max: 1}).then(collected => {
                        if (donePre) {return;}
                        if (nums[collected.first().emoji.name] === 'All') {pages = []; let c; for (c of Object.values(helpSorted)) {let h; for (h of c) {pages.push(h)}}}
                        else {pages = helpSorted[nums[collected.first().emoji.name]];}
                        donePre = true;
                        r(true);
                    }).then(() => {donePre = true; r(false);});
                });
            }

            if (!await getCat().catch(() => {})) {return;}
            await require('../../util/wait')(500);

            cle.delete().catch(() => {});

            if (pages.length > 1) {
                let help = new Pagination(message.channel, pages, message, client, true);
                return await help.start({endTime: 60000, user: message.author.id}).catch(() => {});
            } else {return message.channel.send({embeds: [pages[0].setFooter("Natsuki", client.user.avatarURL()).setTimestamp()]}).catch(() => {});}
        } else {
            let command;
            if (client.commands.has(args[0])) {command = client.commands.get(args[0]);}
            else if (client.aliases.has(args[0])) {command = client.commands.get(client.aliases.get(args[0]));}
            else {return message.reply("I don't have that command! Try using `" + prefix + "help` to get a list of my commands");}

            return message.reply(command.help
                ? command.help instanceof Discord.MessageEmbed
                    ? {embeds: [command.help.setFooter("Natsuki | <required> [optional]", client.user.avatarURL()).setColor("c375f0").setTimestamp()]}
                    : command.help.replace(/{{p}}/g, prefix)
                : "I don't seem to have any help info available for that command."
            );
        }
    }
};