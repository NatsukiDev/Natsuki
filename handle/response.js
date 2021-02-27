const Discord = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');

module.exports = client => {
    var responses = fs.readdirSync('./responses').filter(file => file.endsWith('.js'));
    console.log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Getting Responses...')}\n`);
    for (let responsef of responses) {
        if (Object.keys(require.cache).includes(require.resolve(`../responses/${responsef}`))) {delete require.cache[require.resolve(`../responses/${responsef}`)];}
        var response = require(`../responses/${responsef}`);
        client.responses.triggers.push([response.name, response.condition]);
        client.responses.commands.set(response.name, response);
        console.log(`${chalk.gray('[LOAD]')} >> ${chalk.blueBright('Loaded Response')} ${chalk.white(response.name)}`);
    }
    console.log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Loaded all Responses')}`);
};