import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {SlashCommandBuilder} from '@discordjs/builders';
import {Client, CommandInteraction} from 'discord.js';

export class SlashCommand {

    response: (client: Client, interaction: CommandInteraction) => any;
    command: SlashCommandBuilder;
    registerMode: RegisterMode = 'global';
    enabled: boolean = false;

    readonly name: string;
    readonly client: Client;
    readonly rest: REST;



    constructor(name: string, client: Client, command: SlashCommandBuilder, response: (client: Client, interaction: CommandInteraction) => any, registerMode?: RegisterMode) {
        this.name = name;
        this.command = command;
        this.response = response;
        this.client = client;
        if (registerMode) {this.registerMode = registerMode;}

        this.rest = new REST({version: '9'}).setToken(this.client.token);
    }



    public async register(forceMode?: RegisterMode): Promise<unknown> {
        let mode = typeof forceMode !== 'undefined' ? forceMode : this.registerMode;
        if (mode === 'global' || mode.global) {
            return this.rest.put(Routes.applicationCommands(this.client.user.id), {body: [this.command.toJSON()]});
        } else {
            if (Array.isArray(mode.serverIDs) && mode.serverIDs.length !== 1) {
                let res = [];
                mode.serverIDs.forEach(id => res.push(this.rest.put(Routes.applicationGuildCommands(this.client.user.id, id), {body: [this.command.toJSON()]})));
                return Promise.all(res);
            }
            else {
                return this.rest.put(Routes.applicationGuildCommands(this.client.user.id, Array.isArray(mode.serverIDs) ? mode.serverIDs[0] : mode.serverIDs), {body: [this.command.toJSON()]});
            }
        }
    };

    public async registerGlobally() {
        return await this.register('global');
    };

    public async registerToServer(serverIDs: string[]) {
        return await this.register({serverIDs: serverIDs});
    };

    public setResponse(newResponse: (client: Client, interaction: CommandInteraction) => any): SlashCommand {
        this.response = newResponse;
        return this;
    };

    public async disable() {};

    public setDefaultRegisterMode(mode: RegisterMode): SlashCommand {
        this.registerMode = mode;
        return this;
    };

    public async respond(client: Client, interaction: CommandInteraction): Promise<any> {
        return this.response(client, interaction);
    };

    public setCommand(newCommand: SlashCommandBuilder): SlashCommand {
        this.command = newCommand;
        return this;
    }

};


export type RegisterMode = {serverIDs: string[], global?: boolean} | "global";