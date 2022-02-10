import Discord = require("discord.js");
import fs = require('fs');
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';

import {RegisterMode, SlashCommand} from "./slash";

export class SlashManager {

    client: Discord.Client;
    commands: SlashCommand[];
    testServerId: string;
    beforeHandle: (client: Discord.Client, interaction: Discord.CommandInteraction) => any = () => {};
    afterHandle: (client: Discord.Client, interaction: Discord.CommandInteraction, success: boolean) => any = () => {};

    private initialized: boolean = false;
    private rest: REST;

    constructor(client: Discord.Client, commands?: SlashCommand[], testServer?: string) {
        this.client = client;
        this.commands = commands || [];
        if (this.testServerId) {this.testServerId = testServer;}
        this.rest = new REST({version: '9'}).setToken(this.client.token);
    }



    public async register(commands?: CommandLookup): Promise<any> {
        let trp = commands || this.commands;
        let tr = Array.isArray(trp) ? this.getCommands(trp) : this.getCommand(trp);
        return Array.isArray(tr)
            ? this.rest.put(Routes.applicationCommands(this.client.user.id), {body: (() => {let t = []; tr.forEach(trt => t.push(this.commands[trt].command.toJSON())); return t;})()}) 
            : this.commands[tr].registerGlobally();
    };

    public async devRegister(commands?: CommandLookup): Promise<any> {
        if (!this.testServerId) {throw new Error("You tried to register commands to your test server, but don't have a test server ID set. Try running SlashManager#setTestServer() first!");}
        let trp = commands || this.commands;
        let tr = Array.isArray(trp) ? this.getCommands(trp) : this.getCommand(trp);
        return Array.isArray(tr)
            ? this.rest.put(Routes.applicationGuildCommands(this.client.user.id, this.testServerId), {body: (() => {let t = []; tr.forEach(trt => t.push(this.commands[trt].command.toJSON())); return t;})()})
            : this.commands[tr].registerToServer([this.testServerId]);
    };

    public add(command: SlashCommand, register?: boolean | RegisterMode): SlashManager {
        this.commands.push(command);
        if (register) {command.register(typeof register === 'boolean' ? 'global' : register);}
        return this;
    };

    public remove(commands: CommandLookup): SlashManager {
        let trp = commands || this.commands;
        let tr = Array.isArray(trp) ? this.getCommands(trp) : this.getCommand(trp);
        if (Array.isArray(tr)) {tr.forEach(t => {this.commands.splice(t, 1);});}
        else {this.commands.splice(tr, 1);}
        return this;
    };

    public getCommand(command: SlashCommand | string): number {
        let res: SlashCommand;
        if (typeof command === "string") {
            this.commands.forEach(cmd => {if (cmd.name === command) {res = cmd;}});
            if (!res) {throw new Error(`Name '${command}' doesn't match any commands in your SlashManager.`);}
        } else {
            if (!this.commands.includes(command)) {throw new Error(`The command you provided (with name '${command.name}') doesn't exist`);}
            res = command;
        }
        return this.commands.indexOf(res);
    };

    public getCommands(commands: SlashCommand[] | string[]): number[] {
        let res = [];
        commands.forEach((cmd: SlashCommand | string) => res.push(this.getCommand(cmd)));
        return res;
    };

    public init(): SlashManager {
        if (this.initialized) {this.disableHandling();}
        this.client.on("interactionCreate", (interaction: Discord.CommandInteraction) => this.handle(interaction));
        return this;
    };

    public disableHandling(): SlashManager {
        this.client.removeListener('interactionCreate', this.handle);
        return this;
    };
    
    public setBeforeHandle(execute: (client: Discord.Client, interaction: Discord.CommandInteraction) => any): SlashManager {
        this.beforeHandle = execute;
        this.init();
        return this;
    };

    public setAfterHandle(execute: (client: Discord.Client, interaction: Discord.CommandInteraction, success: Boolean) => any): SlashManager {
        this.afterHandle = execute;
        this.init();
        return this;
    };

    public setTestServer(id: string): SlashManager {
        this.testServerId = id;
        return this;
    };


    private async handle(interaction: Discord.CommandInteraction): Promise<any> {
        this.beforeHandle(this.client, interaction);
        let success = true;
        // @ts-ignore
        let defaultPrefix = this.client.misc.config.dev ? 'n!' : 'n?';
        try {
            await this.commands[this.getCommand(interaction.commandName)]
                .respond(this.client, interaction,
                    interaction.inGuild() ? interaction.guild : false,
                    // @ts-ignore
                    interaction.inGuild() ? this.client.guildconfig.prefixes.has(interaction.guild.id) ? this.client.guildconfig.prefixes.get(interaction.guild.id) !== null ? this.client.guildconfig.prefixes.get(interaction.guild.id) : defaultPrefix : defaultPrefix : defaultPrefix
                ).catch((e) => {console.log(e); success = false;});
        }
        catch (e) {success = false;}
        this.afterHandle(this.client, interaction, success);
    };



    public importCommands(register: boolean | RegisterMode = false, dir: string = './slash', log: (command: SlashCommand, manager: SlashManager) => void = () => {}): SlashManager {
        const search = (toSearch: string): void => {
            let cdir = fs.readdirSync(toSearch);
            const commands = cdir.filter(file => file.endsWith('.js'));
            for (const command of commands) {
                const slashCommand = require(`../${toSearch}/${command}`)(this.client);
                this.add(slashCommand, register);
                log(slashCommand, this);
            }
            const subdirs = cdir.filter(file => fs.lstatSync(`${toSearch}/${file}`).isDirectory());
            subdirs.forEach(subdir => search(`${toSearch}/${subdir}`));
        };
        search(dir);
        return this;
    };

}


type CommandLookup = SlashCommand[] | SlashCommand | string | string[];