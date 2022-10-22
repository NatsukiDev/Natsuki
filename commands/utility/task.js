const Discord = require('discord.js');

const Tasks = require("../../models/task");

module.exports = {
    name: "task",
    aliases: ['t'],
    meta: {
        category: 'Utility',
        description: "Create and manage server-wide tasks for checklists",
        syntax: '`task <create|pulse|list|assign|delete|edit|resign|complete|decomplete|status>`',
        extra: null,
        guildOnly: true
    },
    help: new Discord.MessageEmbed()
        .setTitle("Help -> Tasks")
        .setDescription("Tasks are a subset of checklists (`checklist`). They are based server-wide and are locked to the server. Only task or checklist assignees can mark a task as complete.")
        .addField("Syntax", "`task <create|pulse|list|assign|delete|edit|resign|complete|decomplete|status>`"),
    async execute(message, msg, args, cmd, prefix, mention, client) {
        if (!args.length) {return message.channel.send(`Syntax: \`${prefix}task <create|pulse|list|assign|delete|edit|resign|complete|decomplete|status>\``);}
        
    }
};