const ora = require('ora');

module.exports = async (text, promise, callback) => {
    let spin = ora(text).start();
    await promise
        .catch(e => callback(spin, e))
        .then((...args) => {
            spin.stop();
            spin.clear();
            callback(spin, args);
        });
};