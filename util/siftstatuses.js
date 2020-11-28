const UserData = require('../models/user');
const StatusCache = require('../models/statuses');

module.exports = async function (client, lookFor) {
    let statusesm = await StatusCache.findOne({f: 'lol'}) || new StatusCache({f: 'lol', statuses: []});
    let statuses = statusesm.statuses;
    let date = new Date();
    let ns = [];
    if (!client) {return 'no client found or given';}
    let status; for (status of statuses) {
        if (date.getTime() > status.clear.getTime()) {
            if (lookFor && status.id !== lookFor) {continue;}
            let tu = await UserData.findOne({uid: status.id});
            if (tu) {
                tu.statusmsg = '';
                tu.statustype = '';
                tu.save();
                let u = await client.users.fetch(status.id);
                if (u) {u.send("Heya! Your status has been set for 12 hours, so I've cleared it for you.").catch(() => {});}
            }
        } else {ns.push(status);}
    }
    statusesm.statuses = ns;
    return statusesm.save();
};