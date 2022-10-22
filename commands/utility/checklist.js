const Discord = require('discord.js');

const GuildLists = require("../../models/guildlist");
const Checklists = require("../../models/checklist");

const ask = require('../../util/ask');
const makeId = require('../../util/makeid');

module.exports = {
    name: "checklist",
    aliases: ['chl', 'list'],
    meta: {
        category: 'Utility',
        description: "Create and manage checklists, which let you manage tasks for server members",
        syntax: '`checklist <create|list|admin|view|edit|delete|archive|assign|unassign>`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Checklists")
        .setDescription("Checklists manage large goals for your server, for any purpose, and can be assigned tasks, members, and more.")
        .addField("Creation", "Use `checklist admin` to toggle admin-locked checklist creation, making it so only admins can make checklists.")
        .addField("Syntax", "`checklist <create|list|admin|view|edit|delete|archive|assign|unassign>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}checklist <create|list|admin|view|edit|delete|archive|assign|unassign>\``);}

        const o = args[0].toLowerCase();
        if (['c', 'new', 'create'].includes(o)) {
            let gl = await GuildLists.findOne({gid: message.guild.id});
            if (gl && gl.admin && !message.member.permissions.has("ADMINISTRATOR")) {return message.channel.send("You must be a server administrator in order to make new lists!");}
            if (gl && gl.lists.length == 15) {return message.channel.send("Your server has reached the checklist maximum of 15!");}
            const name = await ask(message, "What would you like to call this checklist?", 60000); if (!name) {return;}
            if (name.length > 50) {return message.channel.send("Your list's name is too long!");}
            const desc = await ask(message, "What is the main purpose of this list?", 120000); if (!desc) {return;}
            if (desc.length > 400) {return message.channel.send("Please shorten that description a little!");}
            let image = null;
            let conf = await ask(message, "Would you like to add an image to your list?", 60000); if (!conf) {return;}
            if (['yes', 'ye', 'y', 'sure'].includes(conf.trim().toLowerCase())) {
                image = await ask(message, `Please paste the image or a link to the image you'd like to add to your new checklist.`, 60000, false, true);
                if (!image || !image.match(/^https:\/\/(?:[\w\-].?)+[\/\w\-%()_]+\.(?:png|jpg|jpeg|gif|webp)$/gm)) {return message.channel.send("I don't think that's an image. Try again?");}
            }
            if (!gl) {gl = new GuildLists({gid: message.guild.id});}
            
        }
    }
};