let tss = {
    members: [
        {
            name: "wubzy",
            id: "4545",
            info: "stuff"
        },
        {
            name: "slushie",
            id: "3434",
            info: "wow"
        },
        {
            name: "kyusa",
            id: "6767",
            info: "e"
        },
        {
            name: "swag",
            id: "8989",
            info: "xd"
        },
        {
            name: "doge",
            id: "0101",
            info: "homks"
        },
        {
            name: "vincent",
            id: "6666",
            info: "shrekt"
        }
    ],
    assignments: []
}

let dm = []; let rm;
let m; for (m of tss.members) {dm.push({name: m.id, assignedTo: null});}
for (m of dm) {
    while (true) {
        let rm = tss.members[Math.floor(Math.random() * tss.members.length)];
        let exists = false;
        let cdm; for (cdm of dm) {if (!exists) {exists = cdm.assignedTo === rm.id;}}
        if (!exists && rm.id !== m.name) {dm[dm.indexOf(m)] = {name: m.name, assignedTo: rm.id}; break;}
    }
}
tss.assignments = dm;

console.log(tss);