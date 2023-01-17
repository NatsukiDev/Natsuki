module.exports = async client => {
    client.basePrefix = client.config.options.dev ? client.config.options.prefix || client.config.bot.devPrefix : client.config.bot.prefix;

    require('../../startup/run/hello')(client); // startup info
    require('../../startup/run/setstatus')(client);

    require('../../../api/index')(client);
};