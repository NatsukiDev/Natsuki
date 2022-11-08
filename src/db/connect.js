const chalk = require('chalk');
const mongoose = require('mongoose');

const log = require('../util/log/log');
const ora = require('../util/log/ora');

module.exports = async client => {
    const auth = client.auth;
    const t = Date.now();
    client.misc.dbconnected = false;
    await ora(chalk.blueBright.bold.underline("Connecting to MongoDB..."),
        mongoose.connect(`mongodb+srv://${auth.database.user}:${auth.database.password}@${auth.database.cluster}.3jpp4.mongodb.net/test`, {
            useFindAndModify: false, useNewUrlParser: true, dbName: auth.database.name, useUnifiedTopology: true, useCreateIndex: true
        })
        ).catch((e) => client.error("Failed to connect to mongoose!! Error below.", 0, true, true, e))
        .then(() => {client.misc.dbconnected = true;});
    if (!client.misc.dbconnected) {
        client.warn("Database not connected, considering runtime to be unusable and exiting.", 0, true, true);
        throw new Error();
    }
    return client.success(`Connected to Mongo Database in ${chalk.white(`${Date.now() - t}ms`)}.`);
};