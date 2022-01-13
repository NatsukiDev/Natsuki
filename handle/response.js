const Discord = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
const gs = require('gradient-string');

let iters = ['command', 'event', 'response'];

module.exports = client => {
    return new Promise(resolve => {
        var responses = fs.readdirSync('./responses').filter(file => file.endsWith('.js'));
        const log = client.misc.config.spinners ? (i) => client.misc.cache.spinLog.push(i) : (i) => console.log(i);
        log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Getting Responses...')}\n`);
        for (let responsef of responses) {
            if (Object.keys(require.cache).includes(require.resolve(`../responses/${responsef}`))) {delete require.cache[require.resolve(`../responses/${responsef}`)];}
            var response = require(`../responses/${responsef}`);
            client.responses.triggers.push([response.name, response.condition]);
            client.responses.commands.set(response.name, response);
            log(`${chalk.gray('[LOAD]')} >> ${chalk.blueBright('Loaded Response')} ${chalk.white(response.name)}`);
        }
        log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Loaded all Responses')}`);
        client.misc.cache.spin.success('response', {text: iters.map(i => `Loaded ${i.slice(0, 1).toUpperCase()}${i.slice(1)}s`).map(i => client.misc.config.gradients ? gs.instagram(i) : chalk.blue(i))[2]});
        resolve(0);
    });
};