const logger = require('./src/util/ts/log/log');
const client = {test: 'e', config: {logLevel: 1}};
const log = logger(client);
log();