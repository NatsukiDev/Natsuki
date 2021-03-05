const Discord = require('discord.js');

const TD = require('../../models/todo');

const ask = require('../../util/ask');

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

        if (['add', 'a'].includes(args[0].toLowerCase())) {
            let list = 'quick';
            let td = await TD.findOne({uid: message.author.id});
            if (td && td.lists.quick.length > 20) {return message.channel.send("Sorry, but your list can only have 20 items or less.");}
            let item;
            if (!args[1]) {item = await ask(message, "What would you like to add to your quick list?", 90000); if (!item) {return;}}
            else {args.shift(); item = args.join(" ");}
            if (item.length > 100) {return message.channel.send("ToDo items can only be less than 100 characters.");}
            td = td || new TD({uid: message.author.id});
            td.lists.quick.push(item);
            td.markModified(`lists.${list}`);
            td.save();
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor("To-Do Added!", message.author.avatarURL())
                .setDescription(`${item}\n\`->\` In list '${list}'`)
                .setColor('c375f0')
            );
        }

        else if (['v', 'view'].includes(args[0].toLowerCase())) {
            let list = 'quick';
            let td = await TD.findOne({uid: message.author.id});
            if (!td) {return message.channel.send("You don't have any todo lists!");}
            if (!td.lists[list]) {return message.channel.send("That list doesn't exist!");}
            if (!td.lists[list].length) {return message.channel.send("That list is empty!");}
            let s = '';
            let n = 0; let i; for (i of td.lists[list]) {n++; s += `**${n}.** ${i}\n`;}
            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor(message.guild ? message.member.displayName : message.author.username, message.author.avatarURL())
                .setTitle(list === "quick" ? "Personal Quick List" : `List "${list}"`)
                .setDescription(s)
                .setColor("c375f0")
                .setFooter("Natsuki")
                .setTimestamp()
            );
        }

        else if (['d', 'delete', 'r', 'remove'].includes(args[0].toLowerCase())) {

        }

        else {return message.channel.send("Invalid arg! Use `<add|list|delete|edit|view|complete|uncomplete>`");}
    }
};