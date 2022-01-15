const AR = require('../../models/ar');
const chalk = require('chalk');

module.exports = async (client, spinner) => {
    return new Promise(async resolve => {
        const st = new Date().getTime();

        client.misc.cache.ar = new Map();
        client.misc.cache.arIgnore = new Map();
        let amount = 0;

        for await (const ar of AR.find()) {
            client.misc.cache.ar.set(ar.gid, ar.triggers);
            if (ar.ignoreChs.length) {client.misc.cache.arIgnore.set(ar.gid, ar.ignoreChs);}
            spinner.update({text: `${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${amount}`)} ${chalk.blueBright(`guilds with auto responses.`)}`});
            amount++;
        }

        const cacheTime = new Date().getTime() - st;
        spinner.update({text: `${spinner.options.text.slice(0, 19).trim()} ${chalk.gray(`${cacheTime}ms >>`.padStart(8, '0').padStart(7, '0'))} ${spinner.options.text.slice(19).trim()}`});
        spinner.status('non-spinnable');
        resolve(0);
    });
};