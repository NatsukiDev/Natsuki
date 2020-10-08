const {Tag} = require('./tag');
const {TagFilter} = require('./tagfilter');

let myATag = new Tag(["-name", "-n"], "name", "append");
let myTTag = new Tag(["force"], "force", "toggle");
myTTag.addTrigger('f');

console.log(myATag);
console.log(myTTag);

let myFilter = new TagFilter([myATag, myTTag]);
console.log(myFilter);
console.log(myFilter.test("create -n jacob clark -f"));

console.log(new TagFilter([
    new Tag(['-reason', '-r'], 'reason', 'append'),
    new Tag(['-against', '-a'], 'against', 'append'),
    new Tag(['-force', '-f'], 'force', 'toggle')
]).test('d6 d6 d10 -r to suffer -against myself -f'));