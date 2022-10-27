const ora = require('ora');

module.exports = async (text, promise, callback) => {
    return new Promise(async (resolve, reject) => {
        let spin = ora(text).start();
        return await promise
            .catch(e => {
                spin.stop();
                spin.clear();
                return reject(e)
            })
            .then((...args) => {
                spin.stop();
                spin.clear();
                return callback ? resolve(callback(spin, args)) : resolve(true);
            });
    });
};