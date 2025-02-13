const chalk = require('chalk');
const mongoose = require('mongoose');

const ora = require('../util/log/ora');

module.exports = async client => {
    if (!client.misc) {client.misc = {};}
    const auth = client.auth;
    const t = Date.now();
    client.misc.dbconnected = true;
    await ora(chalk.blueBright.bold.underline("Connecting to MongoDB..."),
        mongoose.connect(`mongodb+srv://${auth.database.user}:${auth.database.password}@${auth.database.cluster}.3jpp4.mongodb.net/test`, {
            dbName: auth.database.name //TODO research mongo connect options
        })
        ).catch((e) => {
            client.error("Failed to connect to mongoose!! Error below.", 0, 0, true, e);
            client.misc.dbconnected = false;
        });
    if (!client.misc.dbconnected) {
        client.warn("Database not connected, considering runtime to be unusable and exiting.", 0, true, true);
        throw new Error();
    }
    return client.success(`Connected to Mongo Database in ${chalk.white(`${Date.now() - t}ms`)}.`, 0, 0, 1);
};