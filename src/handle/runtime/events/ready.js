module.exports = async client => {
    client.basePrefix = client.config.options.dev ? client.config.options.prefix || client.config.bot.devPrefix : client.config.bot.prefix;

    await require('../../../api/index')(client);

    require('../../startup/run/hello')(client); // startup info
    require('../../startup/run/setstatus')(client);

    client.log(client.utils.gr(client.config.randResp.cliloaded), {color: "#78d9f8", source: client.config.bot.consoleName}, true, true); //natsuki doing some more complaining
};