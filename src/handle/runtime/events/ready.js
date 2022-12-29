module.exports = async client => {
    client.basePrefix = client.config.options.dev ? client.config.options.prefix || "n!" : "n?";

    require('../../startup/run/hello')(client); // startup info
    require('../../startup/run/setstatus')(client);

    require('../../../api/index')(client);
};