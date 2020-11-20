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

let dm = []; let cm; let rm; let rm2;

let mg; let asg = []; for (mg of dm) {asg.push({name: mg[0].id, assignedTo: mg[1].id});}
tss.assignments = asg;

console.log(tss);