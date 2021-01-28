const Discord = require('discord.js');
const chalk = require('chalk');

const {Tag} = require('../util/tag');
const {TagFilter} = require('../util/tagfilter');

module.exports = {
    name: 'eval',
    aliases: ['ev', ':', 'e'],
    help: "Evaluates raw JavaScript code. *This is a __developer-only__ command.* Usage: `{{p}}eval <code>`",
    meta: {
        category: 'Developer',
        description: "Evaluates raw JavaScript code. Nerd access only.",
        syntax: '`eval <code>`',
        extra: null
    },
    execute(message, msg, args, cmd, prefix, mention, client) {
        try {
            if (!client.developers.includes(message.author.id)) {return message.channel.send("Sorry, but I've got trust issues, so only me devs can go commanding me around like that.");};
            if (!args.length) return message.channel.send(`Syntax: \`${prefix}eval <code>\``);            

            let options = new TagFilter([new Tag(['s', 'silent', 'nr', 'noreply'], 'silent', 'toggle')]).test(args[0]);
            if (options.silent) {args.shift();}

            if (!args.length) {return message.channel.send("Silly goose, if you want me to do something, you have to tell me what!");}
            const result = new Promise((resolve) => resolve(eval(args.join(' '))));
            return result.then((output) => {
            if (typeof output !== 'string') {
                output = require('util').inspect(output, {depth: 0});
            }
            output = output.replace(client.config.token, 'Client Token')
            .replace(client.config.database.password, 'Database Password')
            .replace(client.config.database.cluster, 'Database Cluster');

            return options.silent ? null : message.channel.send(new Discord.MessageEmbed()
            .setTitle('Client Evaluation')
            .setDescription(`\`\`\`js\n${output}\n\`\`\``)
            .setColor('c375f0')
            .setFooter(`Natsuki`, client.user.avatarURL())
            .setTimestamp());
        }).catch(error => {return message.channel.send(`Error: \`${error}\`.`);});
        } catch (error) {
            let date = new Date; date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
            console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | Occurred while trying to run n?eval`)}`, error);
            return message.channel.send(`Error: \`${error}\`.`);
        }
    },
};