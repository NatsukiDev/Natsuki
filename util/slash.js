"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommand = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
class SlashCommand {
    constructor(name, client, command, response, registerMode) {
        this.registerMode = 'global';
        this.enabled = false;
        this.name = name;
        this.command = command;
        this.response = response;
        this.client = client;
        if (registerMode) {
            this.registerMode = registerMode;
        }
        this.rest = new rest_1.REST({ version: '9' }).setToken(this.client.token);
    }
    async register(forceMode) {
        let mode = typeof forceMode !== 'undefined' ? forceMode : this.registerMode;
        if (mode === 'global' || mode.global) {
            return this.rest.put(v9_1.Routes.applicationCommands(this.client.user.id), { body: [this.command.toJSON()] });
        }
        else {
            if (Array.isArray(mode.serverIDs) && mode.serverIDs.length !== 1) {
                let res = [];
                mode.serverIDs.forEach(id => res.push(this.rest.put(v9_1.Routes.applicationGuildCommands(this.client.user.id, id), { body: [this.command.toJSON()] })));
                return Promise.all(res);
            }
            else {
                return this.rest.put(v9_1.Routes.applicationGuildCommands(this.client.user.id, Array.isArray(mode.serverIDs) ? mode.serverIDs[0] : mode.serverIDs), { body: [this.command.toJSON()] });
            }
        }
    }
    ;
    async registerGlobally() {
        return await this.register('global');
    }
    ;
    async registerToServer(serverIDs) {
        return await this.register({ serverIDs: serverIDs });
    }
    ;
    setResponse(newResponse) {
        this.response = newResponse;
        return this;
    }
    ;
    async disable() { }
    ;
    setDefaultRegisterMode(mode) {
        this.registerMode = mode;
        return this;
    }
    ;
    async respond(client, interaction, guild, prefix) {
        return this.response(client, interaction, guild, prefix);
    }
    ;
    setCommand(newCommand) {
        this.command = newCommand;
        return this;
    }
}
exports.SlashCommand = SlashCommand;
;
