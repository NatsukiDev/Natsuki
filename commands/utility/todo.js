const Discord = require('discord.js');

const TD = require('../../models/todo');

const ask = require('../../util/ask');
const wait = require('../../util/wait');

module.exports = {
    name: "todo",
    aliases: ['td'],
    meta: {
        category: 'Utility',
        description: "Create and manage your To-Do lists!",
        syntax: '`todo <add|list|delete|edit|view|complete|uncomplete>`',
        extra: null
    },
    help: new Discord.MessageEmbed()
    .setTitle("Help -> To-Do Lists")
    .setDescription("Create and manage your To-Do lists. You can use the commands like `add` or `view` without specifying a list to see your `quick` list, which is just quick random stuff. Otherwise, you can specify a list name first to manage it.")
    .addField("Syntax", "`todo <add|list|delete|edit|view|complete|uncomplete>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}todo <add|list|delete|edit|view|complete|uncomplete>\``);}

        let list = 'quick';

        if (['l', 'list', 'lists'].includes(args[0].toLowerCase())) {
            args.shift();
            if (!args.length) {return message.channel.send(`List syntax: \`${prefix}todo list <create|delete|list|listName>\`. Use your list's name and then \`<add|list|delete|edit|view|complete|uncomplete>\` to manage the list's items.`);}
            if (args[0].toLowerCase() === 'quick') {return message.channel.send(`To manage your personal quick list, please use the list syntax without \`list quick\` added. (Use \`${prefix}help todo\` for help.)`);}

            let td = await TD.findOne({uid: message.author.id});

            if (['create', 'c', 'n', 'new', 'a', 'add'].includes(args[0].toLowerCase())) {
                if (td && Object.keys(td.lists).length === 10) {return message.channel.send("Sorry, but you've reached the maximum list count of 10. Delete some lists you've completed... or get off your bum and maybe start checking off some items? :eyes:");}
                let ln;
                if (!args[1]) {
                    ln = await ask(message, "What would you like your list's name to be? This question will time out in 30s", 60000);
                    if (!ln) {return message.channel.send("This question has timed out.");}
                } else {ln = args[1].trim().toLowerCase();}
                if (ln.length > 15) {return message.channel.send("List names must be 15 characters or less.");}
                if (!ln.match(/^[a-z-]+$/gm)) {return message.channel.send("List names must contain only letters and hyphens.");}
                if (['create', 'c', 'n', 'new', 'a', 'add', 'd', 'delete', 'r', 'remove', 'l', 'list', 'e', 'edit', 'v', 'view', 'comp', 'complete', 'uc', 'uncomp', 'uncomplete'].includes(ln)) {return message.channel.send("That list name is invalid as it is used for the functionality of this command.");}
                if (ln === 'quick') {return message.channel.send("You cannot use that name as it is used for your personal list.");}
                if (td && td.lists[ln]) {return message.channel.send("You already have a list with that name.");}
                td = td || new TD({uid: message.author.id});
                td.lists[ln] = [];
                td.markModified(`lists.${ln}`);
                await td.save();
                let totalItems = 0;
                Object.keys(td.lists).forEach(l => totalItems += td.lists[l].length);
                return message.channel.send({content: `Your list was successfully created!`, embeds: [new Discord.MessageEmbed()
                    .setAuthor(message.guild ? message.member.displayName : message.author.username, message.author.avatarURL())
                    .setTitle(`List Created: ${ln}`)
                    .setDescription(`You now have **${Object.keys(td.lists).length}** lists (including your personal list) with a total of **${totalItems} items**.`)
                    .addField("Managing", `-To add to your new list, use \`${prefix}todo list ${ln} add\`.\n-To view its items, use \`${prefix}todo list ${ln} view\`.\n-To delete this list, use \`${prefix}todo list delete ${ln}\`.`)
                    .setColor("c375f0")
                    .setFooter("Natsuki")
                    .setTimestamp()]
                });
            } else if (['d', 'delete', 'r', 'remove'].includes(args[0].toLowerCase())) {
                if (!td || td.lists.length === 1) {return message.channel.send("You don't have any lists made, or you only have a quick list.");}
                let ln;
                if (!args[1]) {
                    let s = ``; let lists = Object.keys(td.lists);
                    let i; for (i = 0; i < lists.length; i++) {if (lists[i] === 'quick') {continue;} s += `**${i}**. \`${lists[i]}\` - ${td.lists[lists[i]].length} ${td.lists[lists[i]].length === 1 ? 'item' : 'items'}\n`;}
                    message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setAuthor(message.guild ? message.member.displayName : message.author.username, message.author.avatarURL())
                        .setTitle(`Your ToDo lists`)
                        .setDescription(s)
                        .addField("Deletion", "To delete a list, please reply with the **name** of the list you'd like to delete.")
                        .setColor("c375f0")
                        .setFooter("Natsuki")
                        .setTimestamp()
                    ]});
                    let collected;
                    try {collected = await message.channel.awaitMessages({filter: m => m.author.id === message.author.id, errors: ['time'], time: 60000, max: 1});}
                    catch {return message.channel.send("This question has timed out. Please try again!");}
                    ln = collected.first().content.trim();
                } else {ln = args[1].trim().toLowerCase();}
                if (!td.lists[ln]) {return message.channel.send("You don't have a list that matches that name!");}
                delete td.lists[ln];
                td.markModified(`lists.${ln}`);
                await td.save();
                let num = Math.ceil(Math.random() * 10);
                return message.channel.send(num === 5
                    ? "I've successfully yeeted that list off the face of the planet for you!"
                    : ["Good riddance! I've removed that list for you.", "Spring cleanup! That list is gone.", "That's a whole chunk of stuff you don't gotta worry about anymore. I've made sure of that.", "Fear not, I've made sure that list won't bug you anymore."][Math.floor(Math.random() * 4)]
                );
            } else if (['l', 'list'].includes(args[0].toLowerCase())) {
                if (!td || td.lists.length === 1) {return message.channel.send("You don't have any lists made, or you only have a quick list.");}
                let s = ``; let lists = Object.keys(td.lists);
                let i; for (i = 0; i < lists.length; i++) {if (lists[i] === 'quick') {continue;} s += `**${i}**. \`${lists[i]}\` - ${td.lists[lists[i]].length} ${td.lists[lists[i]].length === 1 ? 'item' : 'items'}\n`;}
                s += `\nPlus ${td.lists.quick.length} items in your quick list.`;
                return message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setAuthor(message.guild ? message.member.displayName : message.author.username, message.author.avatarURL())
                    .setTitle(`Your ToDo lists`)
                    .setDescription(s)
                    .setColor("c375f0")
                    .setFooter("Natsuki")
                    .setTimestamp()
                ]});
            } else if (td && Object.keys(td.lists).includes(args[0].trim().toLowerCase())) {
                list = args[0].trim().toLowerCase();
                args.shift();
            } else {return message.channel.send("Valid `list` args: `<create|delete|list|listName>`. If you tried to specify a list name, it may not exist or you don't have any lists.");}
            if (!args.length) {return message.channel.send(`You must specify what you want to do with your list! Use \`${prefix}help todo\` if you're confused.`);}
        }

        if (['add', 'a'].includes(args[0].toLowerCase())) {
            let td = await TD.findOne({uid: message.author.id});
            if (td && td.lists[list].length === 25) {return message.channel.send("Sorry, but your list can only have 25 items or less.");}
            let item;
            if (!args[1]) {item = await ask(message, `What would you like to add to your \`${list}\` list?`, 90000); if (!item) {return;}}
            else {args.shift(); item = args.join(" ");}
            if (item.length > 100) {return message.channel.send("ToDo items can only be less than 100 characters.");}
            td = td || new TD({uid: message.author.id});
            td.lists[list].push(item);
            td.markModified(`lists.${list}`);
            td.save();
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor("To-Do Added!", message.author.avatarURL())
                .setDescription(`${item}\n\`->\` In ${list === 'quick' ? "your personal quick list" : `list \`${list}\``}`)
                .setColor('c375f0')
            ]});
        }

        else if (['addmult', 'addmultiple', 'ma', 'am'].includes(args[0].toLowerCase())) {
            let td = await TD.findOne({uid: message.author.id});
            if (td && td.lists[list] && td.lists[list].length === 25) {return message.channel.send("Sorry, but your list can only have 25 items or less.");}
            let items = [];
            let maxItems = td && td.lists[list] ? (25 - td.lists[list].length) : 25;
            let reachedMax = false;
            while (true) {
                if (items.length === maxItems) {
                    reachedMax = true;
                    break;
                }

                let item;
                if (!items.length) {message.channel.send(`What would you like to add to your \`${list}\` list? You're in multiple addition mode, which means you can keep adding items to your list until you say 'done'. To add a new item, just send it in a message.`);}
                try {
                    let col = await message.channel.awaitMessages({filter: m => m.author.id === message.author.id, time: 90000, errors: ['time'], max: 1});
                    item = col.first().content.trim();
                    if (item.toLowerCase() !== 'done') {
                        col.first().react('717197259732942859')
                        .then(r => wait(10000).then(() => r.remove().catch(() => {})))
                        .catch(() => {});
                    }
                } catch {break;}
                if (item.length > 100) {message.channel.send("ToDo items can only be less than 100 characters. Try again, or say \"done\" to stop adding items.");}
                if (item.toLowerCase() === 'done') {break;}
                items.push(item);
            }
            if (!items.length) {return message.reply("Looks like you didn't want to add anything after all...");}
            td = td || new TD({uid: message.author.id});
            items.forEach(item => td.lists[list].push(item));
            td.markModified(`lists.${list}`);
            td.save();
            let resembed = new Discord.MessageEmbed()
                .setAuthor(`To-Do Item${items.length > 1 ? 's' : ''} Added!`, message.author.avatarURL())
                .setDescription(`In ${list === 'quick' ? "your personal quick list" : `list \`${list}\``}\n- ${items.join('\n- ')}`)
                .setColor('c375f0');
            if (reachedMax) {resembed.addField("Notice", "The list addition process was automatically stopped because your list reached the maximum limit of 25 items.");}
            return message.channel.send({embeds: [resembed]});
        }

        else if (['v', 'view'].includes(args[0].toLowerCase())) {
            let td = await TD.findOne({uid: message.author.id});
            if (!td) {return message.channel.send("You don't have any todo lists!");}
            if (!td.lists[list]) {return message.channel.send("That list doesn't exist!");}
            if (!td.lists[list].length) {return message.channel.send("That list is empty!");}
            if (!args[1]) {
                let s = '';
                let n = 0; let i;
                for (i of td.lists[list]) {n++; s += `**${n}.** ${i}\n`;}
                return message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setAuthor(message.guild ? message.member.displayName : message.author.username, message.author.avatarURL())
                    .setTitle(list === "quick" ? "Personal Quick List" : `List: "${list}"`)
                    .setDescription(s)
                    .setColor("c375f0")
                    .setFooter("Natsuki")
                    .setTimestamp()
                ]}).catch(() => {
                    client.users.fetch(client.developers[0]).then(wubzy => wubzy.send("Hey stupid, someone got the todo length bug. Fix it."));
                    return message.channel.send("There was an error displaying your list. It might have too many characters. This bug has been reported to the developers and will be fixed soon! Join the support server for updates.");
                });
            } else {
                if (isNaN(Number(args[1])) && !['last', 'l'].includes(args[1].toLowerCase().trim())) {return message.channel.send("You didn't give me a number!");}
                let id = ['last', 'l'].includes(args[1].toLowerCase().trim()) ? td.lists[list].length : Number(args[1]);
                if (id < 1 || id > td.lists[list].length) {return message.channel.send("Your number was either below 1 or doesn't have a list item to match it.");}
                return message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setAuthor(message.guild ? message.member.displayName : message.author.username, message.author.avatarURL())
                    .setTitle(list === "quick" ? "Personal Quick List" : `List "${list}"`)
                    .setDescription(`List item **#${id}**\n\`->\` ${td.lists[list][id-1]}`)
                    .setColor("c375f0")
                    .setFooter("Natsuki")
                    .setTimestamp()
                ]});
            }
        }

        else if (['d', 'delete', 'r', 'remove'].includes(args[0].toLowerCase())) {
            let td = await TD.findOne({uid: message.author.id});
            if (!td) {return message.channel.send("You don't have any todo lists!");}
            if (!td.lists[list]) {return message.channel.send("That list doesn't exist!");}
            if (!td.lists[list].length) {return message.channel.send("That list is empty!");}
            let collected;
            if (!args[1]) {
                let s = '';
                let n = 0; let i; for (i of td.lists[list]) {n++; s += `**${n}.** ${i}\n`;}
                await message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setAuthor(message.guild ? message.member.displayName : message.author.username, message.author.avatarURL())
                    .setTitle(list === "quick" ? "Personal Quick List" : `List "${list}"`)
                    .setDescription(s)
                    .addField("Deletion", "To remove an item from your list, please reply with the number of the item you no longer want on your list.")
                    .setColor("c375f0")
                    .setFooter("Natsuki")
                    .setTimestamp()
                ]});
                try {collected = await message.channel.awaitMessages({filter: m => m.author.id === message.author.id, errors: ['time'], time: 60000, max: 1});}
                catch {return message.channel.send("This question has timed out. Please try again!");}
                collected = collected.first().content.trim();
            } else {collected = args[1];}
            if (isNaN(Number(collected)) && !['last', 'l'].includes(collected.toLowerCase().trim())) {return message.channel.send("You didn't give me a number!");}
            let id = ['last', 'l'].includes(collected.toLowerCase().trim()) ? td.lists[list].length : Number(collected);
            if (id < 1 || id > td.lists[list].length) {return message.channel.send("Your number was either below 1 or doesn't have a list item to match it.");}
            try {
                let templists = td.lists;
                let temptt = templists[list];
                temptt.splice(id-1, 1);
                templists[list] = temptt;
                td.lists = templists;
                td.markModified(`lists.${list}`);
                td.save();
                return message.channel.send(["That's one item off the list for ya!", "And another one bites the dust! I've removed that item from your todo list.", "And thus the list grows one item smaller!"][Math.floor(Math.random()*3)]);
            } catch {return message.channel.send("There seemed to have been a problem deleting that list item. Contact my devs if the problem persists.");}
        }

        else {return message.channel.send("Invalid arg! Use `<add|list|delete|edit|view|complete|uncomplete>`");}
    }
};