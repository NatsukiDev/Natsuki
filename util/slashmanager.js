"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashManager = void 0;
const fs = require("fs");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
class SlashManager {
    constructor(client, commands, testServer) {
        this.beforeHandle = () => { };
        this.afterHandle = () => { };
        this.initialized = false;
        this.client = client;
        this.commands = commands || [];
        if (this.testServerId) {
            this.testServerId = testServer;
        }
        this.rest = new rest_1.REST({ version: '9' }).setToken(this.client.token);
    }
    async register(commands) {
        let trp = commands || this.commands;
        let tr = Array.isArray(trp) ? this.getCommands(trp) : this.getCommand(trp);
        return Array.isArray(tr)
            ? this.rest.put(v9_1.Routes.applicationCommands(this.client.user.id), { body: [(() => { let t = []; tr.forEach(trt => t.push(this.commands[trt].command.toJSON())); return t; })()] })
            : this.commands[tr].registerGlobally();
    }
    ;
    async devRegister(commands) {
        if (!this.testServerId) {
            throw new Error("You tried to register commands to your test server, but don't have a test server ID set. Try running SlashManager#setTestServer() first!");
        }
        let trp = commands || this.commands;
        let tr = Array.isArray(trp) ? this.getCommands(trp) : this.getCommand(trp);
        return Array.isArray(tr)
            ? this.rest.put(v9_1.Routes.applicationGuildCommands(this.client.user.id, this.testServerId), { body: (() => { let t = []; tr.forEach(trt => t.push(this.commands[trt].command.toJSON())); return t; })() })
            : this.commands[tr].registerToServer([this.testServerId]);
    }
    ;
    add(command, register) {
        this.commands.push(command);
        if (register) {
            command.register(typeof register === 'boolean' ? 'global' : register);
        }
        return this;
    }
    ;
    remove(commands) {
        let trp = commands || this.commands;
        let tr = Array.isArray(trp) ? this.getCommands(trp) : this.getCommand(trp);
        if (Array.isArray(tr)) {
            tr.forEach(t => { this.commands.splice(t, 1); });
        }
        else {
            this.commands.splice(tr, 1);
        }
        return this;
    }
    ;
    getCommand(command) {
        let res;
        if (typeof command === "string") {
            this.commands.forEach(cmd => { if (cmd.name === command) {
                res = cmd;
            } });
            if (!res) {
                throw new Error(`Name '${command}' doesn't match any commands in your SlashManager.`);
            }
        }
        else {
            if (!this.commands.includes(command)) {
                throw new Error(`The command you provided (with name '${command.name}') doesn't exist`);
            }
            res = command;
        }
        return this.commands.indexOf(res);
    }
    ;
    getCommands(commands) {
        let res = [];
        commands.forEach((cmd) => res.push(this.getCommand(cmd)));
        return res;
    }
    ;
    init() {
        if (this.initialized) {
            this.disableHandling();
        }
        this.client.on("interactionCreate", (interaction) => this.handle(interaction));
        return this;
    }
    ;
    disableHandling() {
        this.client.removeListener('interactionCreate', this.handle);
        return this;
    }
    ;
    setBeforeHandle(execute) {
        this.beforeHandle = execute;
        this.init();
        return this;
    }
    ;
    setAfterHandle(execute) {
        this.afterHandle = execute;
        this.init();
        return this;
    }
    ;
    setTestServer(id) {
        this.testServerId = id;
        return this;
    }
    ;
    async handle(interaction) {
        this.beforeHandle(this.client, interaction);
        let success = true;
        try {
            await this.commands[this.getCommand(interaction.commandName)].respond(this.client, interaction).catch((e) => { console.log(e); success = false; });
        }
        catch (e) {
            console.log(e);
            success = false;
        }
        this.afterHandle(this.client, interaction, success);
    }
    ;
    importCommands(dir) {
        dir = dir || './slash';
        const commands = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
        for (const command of commands) {
            this.add(require(`../${dir}/${command}`)(this.client));
        }
        return this;
    }
    ;
}
exports.SlashManager = SlashManager;
