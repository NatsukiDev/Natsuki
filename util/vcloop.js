module.exports = client => {
    client.misc.cache.inVC.forEach(m => {
        if (client.misc.cache.monitEnabled.includes(client.misc.cache.VCG[m])) {
            if (!client.misc.cache.monit[client.misc.cache.VCG[m]]) {
                let tm = await Monitors.findOne({gid: client.misc.cache.VCG[m]});
                client.misc.cache.monit[client.misc.cache.VCG[m]] = {
                    messages: tm.messages,
                    voice: tm.voice,
                    expiry: new Date()
                };
                if (!tm) {return;}
            }
            if (!client.misc.cache.monit) {client.misc.cache.monit = {};}
            if (!client.misc.cache.monit[client.misc.cache.VCG[m]].voice.members[m]) {client.misc.cache.monit[client.misc.cache.VCG[m]].voice.members[m] = 0;}
            client.misc.cache.monit[client.misc.cache.VCG[m]].voice.members[m] += 1;
            client.misc.cache.monit[client.misc.cache.VCG[m]].voice.total += 1;
            client.misc.cache.monit[client.misc.cache.VCG[m]].expiry.setTime(Date.now());
        } else {
            client.misc.cache.inVC.splice(client.misc.cache.inVC.indexOf(m), 1);
            delete client.misc.cache.VCG[m];
        }
    });

    client.misc.cache.activeVC.forEach(vc => {
        let g = client.guilds.cache.filter(g => g.channels.cache.has(vc)).first();
        if (!g) {return;}
        g = g.id;
        if (client.misc.cache.monitEnabled.includes(g)) {
            if (!client.misc.cache.monit[g]) {
                let tm = await Monitors.findOne({gid: g});
                client.misc.cache.monit[g] = {
                    messages: tm.messages,
                    voice: tm.voice,
                    expiry: new Date()
                };
                if (!tm) {return;}
            }
            if (!client.misc.cache.monit) {client.misc.cache.monit = {};}
            if (!client.misc.cache.monit[g].voice.channels[vc]) {client.misc.cache.monit[g].voice.channels[vc] = 0;}
            client.misc.cache.monit[g].voice.channels[vc] += 1;
            client.misc.cache.monit[g].expiry.setTime(Date.now());
        } else {
            client.misc.cache.activeVC.splice(client.misc.cache.activeVC.indexOf(vc), 1);
        }
    });
};