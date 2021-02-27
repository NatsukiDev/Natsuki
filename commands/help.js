const Discord = require("discord.js");

const {Pagination} = require('../util/pagination');
const ask = require('../util/ask');

module.exports = {
    name: "help",
    aliases: ["h", "commands", "cmds"],
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

            let cat = await ask(message, "What would you like help with? (`Fun`|`Roleplay`|`Utility`|`Misc`|`Moderation`|`Social`|`Leveling`) or `all` if you'd like to browse all commands", 60000); if (!cat) {return;}
            if (!['f', 'fun', 'rp', 'roleplay', 'dnd', 'role play', 'rpg', 'dice', 'u', 'util', 'utility', 'utilities', 'm', 'misc', 'miscellaneous', 'mod', 'moderation', 's', 'social', 'leveling', 'l', 'level', 'a', 'all'].includes(`${cat}`.trim().toLowerCase())) {return message.channel.send("That wasn't a valid response! Try again?");}

            let pages;
            if (['f', 'fun'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Fun'];}
            if (['roleplay', 'dnd', 'role play', 'rpg', 'dice'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['RP'];}
            if (['u', 'util', 'utility', 'utilities'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Utility'];}
            if (['m', 'misc', 'miscellaneous'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Misc'];}
            if (['d', 'dev', 'developer'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Developer'];}
            if (['mod', 'moderation'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Moderation'];}
            if (['s', 'social'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Social'];}
            if (['l', 'leveling', 'level'].includes(`${cat}`.trim().toLowerCase())) {pages = helpSorted['Leveling'];}
            if (['a', 'all'].includes(`${cat}`.trim().toLowerCase())) {pages = []; let c; for (c of Object.values(helpSorted)) {let h; for (h of c) {pages.push(h)}}}

            await require('../util/wait')(500);

            if (pages.length > 1) {
                let help = new Pagination(message.channel, pages, message, client, true);
                return await help.start({endTime: 120000, user: message.author.id});
            } else {return message.channel.send(pages[0].setFooter("Natsuki", client.user.avatarURL()).setTimestamp());}
        } else {
            let command;
            if (client.commands.has(args[0])) {command = client.commands.get(args[0]);}
            else if (client.aliases.has(args[0])) {command = client.commands.get(client.aliases.get(args[0]));}
            else {return message.reply("I don't have that command! Try using `" + prefix + "help` to get a list of my commands");}

            return message.reply(command.help
                ? command.help instanceof Discord.MessageEmbed
                    ? command.help.setFooter("Natsuki | <required> [optional]", client.user.avatarURL()).setColor("c375f0").setTimestamp()
                    : command.help.replace(/{{p}}/g, prefix)
                : "I don't seem to have any help info available for that command."
            );
        }
    }
};