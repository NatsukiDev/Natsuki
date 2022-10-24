const logger = require('./src/util/log/log');
const client = {test: 'e', config: {logLevel: 1}};
const loggers = logger(client);
const log = loggers.log;
log();
log("Hello World!")
log("Hello in blue", {color: 'blue'});
log('A strange warning appears!', {color: 'yellowBright', source: 'warn', sourceColor: 'yellow'});
/*log('Extra line spacing before', {}, false, true);
log('regular line');
log('extra line spacing after', {}, true);
log('regular line');
log('both line spaces', {}, true, true);
log('regular line');
log('a custom fancy pink color', {color: '#ff00ff', sourceColor: '#660066'});*/
loggers.warn("A warning appears!");
loggers.error("Something bad happened!");
loggers.success("Something good happened!");