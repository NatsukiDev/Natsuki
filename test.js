const {TagFilter} = require("./util/tagfilter");
const {Tag} = require("./util/tag");

console.log(new TagFilter([
    new Tag(['n', 'name'], 'name', 'append'),
    new Tag(['desc', 'd'], 'description', 'append'),
    new Tag(['f', 'force'], 'force', 'toggle'),
    new Tag(['option', 'o'], 'options', 'listAppend'),
    new Tag(['test', 't'], 'test', 'listAppend')
]).test('blah blah blah -n bonk -d stonks very stonks -f -t some stuff -o an option -test blah blah blah -o another optionl -o hecc -o hecc 2 -test such wow, very flex -t homks.exe has stopped working'));