# Natsuki

The official repository of Natsuki the Discord Bot.

Developed solely by WubzyGD, and intended to help others learn the ropes of discord.js, as well as provide some useful utilities to make the troubles of bot development just a little easier.

Skip down to [**Open-Source**](https://github.com/NatsukiDev/Natsuki#open-source) if you wanna get straight to ~~robbing me~~ seeing some of the awesome stuff Natsuki has to offer.

> Natsuki is now also on Discord.js' latest update, v13!

## Features

Natsuki is an anime-focused Discord bot with more than her fair share of features.

She features lots of different focuses in her commands, as well as:
- **99.99%** uptime over her year of life
- Less than ~**100-150ms** command response time
- **Active**, **open-source** development

> *Oh yeah, and a developer with no life, so she's always being updated*

Natsuki's commands and abilities include, but are absolutely not limited to:

### Moderation

- Kick/Ban/Softban
- Advanced Warning System
- Custom Welcome/Leave Messages
- Autorole/Join-role

### Fun

- Deathnote 👀
- Last.fm API (nowplaying, etc)
- A fully-functional Secret Santa
- ~~A fortune-teller~~ 8ball

### Social

- Over 20 emotes like hug/kiss/cry/sip etc
- AFK/DnD commands
- Bio and user info
- Customizable Star Board
- Customizable auto-responses

### Utility

- Server activity monitoring
- Emoji utilities like creation/robbing
- Random number utilities
- Advanced to-do lists
- Coin-flipping
- Custom prefix

### Leveling

- Levelup messages
- Custom level message channel
- Leveling Roles
- Leaderboard

## FAQ

> *Can I self-host Natuski?*

Natsuki is not meant to be self-hosted. I suppose she is indeed open-source, so if you knew what you were doing, you could build her and self-host her, but I don't condone it.

> *Can I copy Natsuki's code?*

Natuski's utilities (see below) are meant to be downloaded and copied, and some of her frameworking like command handlers are great for copying, but the point of her open-sourcing is not for you to rip apart every command and event. It's primarily for you to make use of the utilities and use the rest as a learning tool to reference and take example from.

Do note that **all** Discord bot lists **do not** allow *any* copying or forking of code. Using my utility classes and functions? Totally okay! :D Forking the repository or copy-pasting all the commands etc etc? Not coolio. 

Bottom line, take what you want, but know that taking too much is not my intention and will hinder your bot's growth.

> *Can I help develop for Natsuki?*

Well gee, I thought you'd never ask! Yes! Simply make changes and submit them as a Pull Request.

If you're an active contributor, I might be able and willing to welcome you as a more permanent and official developer. Important contributors are a important part of the bot, and will be given credit for their efforts!

If developing isn't your thing, you're free to join the support server and suggest something or report a bug. I'm very very much open to suggestions and feedback.

# Open-Source

Here are some useful things to... well... make *use* of in your own code!

## Handlers/Structure

If you check out anything in the `/handle` folder, you'll find some super amazing awesome command and event loaders.

The command loader reads command files in `/commands` based on the template in `template.js`. Aliases are optional, and the help field can be a string or an embed. Commands are automatically loaded up to one subdirectory deep, meaning `commands/command.js` will load, and `commands/somefolder/command.js` will also load.

You'll have to write the commands' execution and help displays on your own, but to get them loaded into client seamlessly and effectively, this is a super strong method.

The event loader will load events from `/events`, whose file names are the discord.js event name. These are automatically placed into your client, so you shouldn't have to worry about adding your own code in this case.

## Utils

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

### Clean Timeout

> util/wait.js

Using Promises, wait an amount of time before you do something, but not have to deal with pesky setTimeout syntax, especially when you don't want to get way too nested with your code.

```js
const wait = require('./util/wait');

let m = await message.channel.send("hacking the mainframe...");
await wait(5000); // time is in ms
return m.edit("mainframe hacked.");
```

Or, alternatively, use `.then()` syntax so your whole code doesn't have to wait.

```js
const wait = require('./util/wait');

let m = await message.channel.send("hacking the mainframe...");
wait(5000).then(() => {return m.edit("mainframe hacked.");});
//some other stuff that will happen without waiting for the message to edit
```

### Other Utils

Have lots of free time and a good knowledge of JavaScript and discord.js?

Check out these files for some more reference and inspiration.

- `/cache/` and `/cache.js` -> A strong way to cache stuff from your database on startup.
- `/lxp/cacheloop.js` -> How I keep a cache of leveling information that is synced periodically and has a 10-minute entry expiry to save memory.
- `/makeid.js` -> Creates a hash string of your choice in length
- Anything in `/response/` -> A massive amount of code to save, parse, send, and filter responses saved by users, which encompasses things like custom embeds and messages, allowing welcome and leave messages to work.