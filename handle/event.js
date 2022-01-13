const fs = require('fs');
const moment = require('moment');
const chalk = require('chalk');
const gs = require('gradient-string');

let iters = ['command', 'event', 'response'];

module.exports = async client => {
    return new Promise(resolve => {
        let eventFilter = fs.readdirSync('./events/').filter(x => x.endsWith('.js'));
        const log = client.misc.config.spinners ? (i) => client.misc.cache.spinLog.push(i) : (i) => console.log(i);
        log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Getting Events...')}\n`);
        for (let file of eventFilter) {
            let evtName = file.split('.')[0];
            if (Object.keys(require.cache).includes(require.resolve('../events/' + file))) {delete require.cache[require.resolve('../events/' + file)];}
            let evt = require('../events/' + file);
            client.removeAllListeners(evtName);
            client.on(evtName, evt.bind(null, client));
            log(`${chalk.gray('[LOAD]')} >> ${chalk.blueBright('Loaded Event')} ${chalk.white(evtName)}`);
        }
        log(`\n${chalk.gray('[BOOT]')} >> ${chalk.blue('Loaded all Events')}`);
        if (client.misc.config.spinners) {client.misc.cache.spin.success('event', {text: iters.map(i => `Loaded ${i.slice(0, 1).toUpperCase()}${i.slice(1)}s`).map(i => client.misc.config.gradients ? gs.instagram(i) : chalk.blue(i))[1]});}
        resolve(0);
    });
};