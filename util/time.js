const moment = require('moment');
require('moment-precise-range-plugin');
const EventEmitter = require('node:events');

module.exports = client => {
    client.misc.timeTracker = new EventEmitter();

    setInterval(() => {

        const time = moment();

        if (time.hour() === 8 && time.minute() === 0) {client.misc.timeTracker.emit('bullySavi');}

        client.misc.timeTracker.emit('minute', time);

    }, 60000);
};