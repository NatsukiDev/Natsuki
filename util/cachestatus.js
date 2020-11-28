const StatusCache = require('../models/statuses');

module.exports = async (id, time) => {
    let statuses = await StatusCache.findOne({f: 'lol'}) || new StatusCache({f: 'lol', statuses: []});
    let exists = false;
    let status; for (status of statuses.statuses) {
        if (status.id === id) {statuses.statuses[statuses.statuses.indexOf(status)].clear = time; exists = true;}
    }
    if (!exists) {statuses.statuses.push({id: id, clear: time});}
    return statuses.save();
};