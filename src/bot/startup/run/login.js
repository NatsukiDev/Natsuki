const chalk = require('chalk');

const ora = require('../../../util/log/ora');

module.exports = async (client) => {
    const t = Date.now();
    client.misc = {};
    client.misc.dscconnected = true;

    await ora(`Waking up Natsuki... ${chalk.blueBright.bold.underline("(Connecting to Discord...)")}`,
        client.login(client.auth.token)
        ).catch((e) => {
            client.error("Failed to connect to Discord!! Error below.", 0, 0, true, e);
            client.misc.dscconnected = false;
        });
    if (!client.misc.dscconnected) {
        client.warn("Discord not connected, considering runtime to be unusable and exiting.", 0, true, true);
        throw new Error();
    }
    return client.success(`Connected to Discord in ${chalk.white(`${Date.now() - t}ms`)}.`, 0, 0, 1);
};
