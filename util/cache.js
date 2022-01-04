const ora = require('ora');
const chalk = require('chalk');

module.exports = async (client) => {
    console.log('');
    let ora_arCache = ora("Caching ARs...").start();
    await require('./cache/ar')(client);
    ora_arCache.stop(); ora_arCache.clear();
    console.log(`${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${client.misc.cache.ar.size}`)} ${chalk.blueBright(`guilds with auto responses.`)}`);

    let ora_blCache = ora("Caching Blacklists...").start();
    await require('./cache/bl')(client);
    ora_blCache.stop(); ora_blCache.clear();
    console.log(`${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${client.misc.cache.bl.guild.length}`)} ${chalk.blueBright(`guild blacklists`)}`);
    console.log(`${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${client.misc.cache.bl.user.length}`)} ${chalk.blueBright(`user blacklists`)}`);

    let ora_lxpCache = ora("Caching Local XPs...").start();
    await require('./cache/lxp')(client);
    ora_lxpCache.stop(); ora_lxpCache.clear();
    console.log(`${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${client.misc.cache.lxp.enabled.length}`)} ${chalk.blueBright(`guilds with XP enabled.`)}`);

    let ora_lrCache = ora("Caching Level Roles...").start();
    await require('./cache/lr')(client);
    ora_lrCache.stop(); ora_lrCache.clear();
    console.log(`${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${client.misc.cache.lxp.hasLevelRoles.length}`)} ${chalk.blueBright(`guilds with Level Roles enabled.`)}`);

    let ora_moCache = ora("Caching Monitors...").start();
    await require('./cache/monit')(client);
    ora_moCache.stop(); ora_moCache.clear();
    console.log(`${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${Object.keys(client.misc.cache.monit).length}`)} ${chalk.blueBright(`guilds with Monitors enabled.`)}`);

    let ora_anCache = ora("Caching Animes...").start();
    await require('./cache/anime')(client);
    ora_anCache.stop(); ora_anCache.clear();
    console.log(`${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${client.misc.cache.animeNum}`)} ${chalk.blueBright(`animes into lookup registry.`)}`);

    let ora_chCache = ora("Caching Characters...").start();
    await require('./cache/char')(client);
    ora_chCache.stop(); ora_chCache.clear();
    console.log(`${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${client.misc.cache.charsNum}`)} ${chalk.blueBright(`characters into lookup registry.`)} ${chalk.gray(`(${client.misc.cache.chars.size} // NN)`)}`);

    let ora_ctCache = ora("Caching Chests...").start();
    await require('./cache/chest')(client);
    ora_ctCache.stop(); ora_ctCache.clear();
    console.log(`${chalk.gray('[PROC]')} >> ${chalk.blueBright(`Cached`)} ${chalk.white(`${client.misc.cache.chests.enabled.length}`)} ${chalk.blueBright("guilds that spawn chests.")}`);
};