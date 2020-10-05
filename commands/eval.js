const Discord = require('discord.js');
const util = require('util');
const moment = require('moment');
const chalk = require('chalk');

module.exports = {
    name: 'eval',
    aliases: ['ev', ':'],
    help: "Evaluates raw JavaScript code. *This is a __developer-only__ command.* Usage: `{{p}}eval <code>`",
    execute(message, msg, args, cmd, prefix, mention, client) {
        try {
            if (!client.developers.includes(message.author.id)) return;

            let kieran = client.users.cache.get('673477059904929802').tag

            if (!args.length) return message.channel.send(`Syntax: \`${prefix}eval <code>\``);
            const result = new Promise((resolve) => resolve(eval(args.join(' '))));
            return result.then((output) => {
            if (typeof output !== 'string') {
                output = require('util').inspect(output, { depth: 0 });
            }
            output = output.replace(client.config.token, 'Client Token')
            .replace(client.config.database.password, 'Database Password')
            .replace(client.config.database.cluster, 'Database Cluster')

            return message.channel.send(new Discord.MessageEmbed()
            .setTitle('Client Evaluation')
            .setDescription(`\`\`\`js\n${output}\n\`\`\``)
            .setColor('c375f0')
            .setFooter(`Natsuki`, client.user.avatarURL())
            .setTimestamp())
        });
        } catch (error) {
            //let date = new Date; date = date.toString().slice(date.toString().search(":") - 2, date.toString().search(":") + 6);
            //console.error(`\n${chalk.red('[ERROR]')} >> ${chalk.yellow(`At [${date}] | Occurred while trying to run n?eval`)}`, error);
            return message.channel.send(`Error: \`${error}\`.`);
        };
    },
};