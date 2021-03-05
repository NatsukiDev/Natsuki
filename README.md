# Natsuki
The official repository of Natsuki the Discord Bot. Currently in the Early Development phase, and is expected to release to a few servers and eventually bot lists relatively soon.

## Utils
*Some useful stuff we have in our bot that you can make use of!*

Just about anything in the utils folder could be useful for a number of reasons, but here's a few big ones:

### Tags
> util/tagfilter.js and util/tag.js

Pass in a list of Tags. Each Tag has a list of triggers, its name, then its mode.

- `toggle` = takes no options. If the tag is present, it will view as `true` in `options`.
- `append` = forms a string from the text after the tag. `-title Something Cool` will return the string `Something Cool`. Will append from all tags that trigger the alias, so if multiple `title` tags are present, all of them will be present in the same string.
- `listAppend` = Behaves like `append`, with the exception that it will return a list where each member is a string for every time the tag is used; see example below

```js
let options = new TagFilter([
    new Tag(['t', '-title'], 'title', 'append'),
    new Tag(['a', 'aliases', 'alts'], 'aliases', 'listAppend'),
    new Tag(['f', 'force'], 'force', 'toggle')
]).test(args.join(" "));

// -title Example -a AnotherName -a Some other name -f

// options will look like this
{
   title: "Example",
   aliases: ["AnotherName", "Some other name"],
   force: true
}
```

### Quick awaitMessages
> util/ask.js

Ask a question and wait for an answer. Returns the string of the user's response, or nothing if there was no response. **Function is asynchronous!**

*Please make sure you account for the chance of timeout.*

Pass in your `message` object, the question to ask, the time - in ms - the user has to respond, and an optional boolean of whether or not to disable the filter, which would make it so that any user can answer the question.

```js
let name = await ask(message, "What is your name?", 30000);
if (!name) {return;} // Function already sends a timeout message, just return here to stop the command from continuing.
return message.channel.send(`Hiya there, ${name}!`);

new Pagination()
```

### Pagination
> util/pagination.ts

Create a pagination based on a list of Discord MessageEmbeds.

Paginations work based off of reactions, and the pages are cycled with the click of the reaction. Pass in the message channel object, a list of embeds, the original message, and your Discord.Client object.

```js
let pages = [/*List of Discord.MessageEmbeds*/];
let help = new Pagination(message.channel, pages, message, client);

await help.setPage(1); //Pages start at 1
await help.setControllers(); //Set the reaction controllers

// OR you can call .start() to do all of this for you.

await help.start({
    endTime: 60000 /*Time in ms before the pagination times out to save memory*/, 
    startPage: 3 /*Page num to start on*/,
    user: 'discord_member_id' /*ID of a member that the Pagination will only listen to*/
}); //All of these are optional.
```

_Please note that the Pagination class is still in the works. Only one bug is currently known, and it's that the Pagination will error when a user tries to end the pagination in a DM channel, but this error is not extremely high-level and shouldn't have any major effects on your node process._

_Another note: you'll want to go into the pagination.js file and search for .setFooter() and change the name Natsuki to whatever name your bot is_