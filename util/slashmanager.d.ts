import Discord = require("discord.js");
import { RegisterMode, SlashCommand } from "./slash";
export declare class SlashManager {
    client: Discord.Client;
    commands: SlashCommand[];
    testServerId: string;
    beforeHandle: (client: Discord.Client, interaction: Discord.CommandInteraction) => any;
    afterHandle: (client: Discord.Client, interaction: Discord.CommandInteraction, success: boolean) => any;
    private initialized;
    private rest;
    constructor(client: Discord.Client, commands?: SlashCommand[], testServer?: string);
    register(commands?: CommandLookup): Promise<any>;
    devRegister(commands?: CommandLookup): Promise<any>;
    add(command: SlashCommand, register?: boolean | RegisterMode): SlashManager;
    remove(commands: CommandLookup): SlashManager;
    getCommand(command: SlashCommand | string): number;
    getCommands(commands: SlashCommand[] | string[]): number[];
    init(): SlashManager;
    disableHandling(): SlashManager;
    setBeforeHandle(execute: (client: Discord.Client, interaction: Discord.CommandInteraction) => any): SlashManager;
    setAfterHandle(execute: (client: Discord.Client, interaction: Discord.CommandInteraction, success: Boolean) => any): SlashManager;
    setTestServer(id: string): SlashManager;
    private handle;
    importCommands(register?: boolean | RegisterMode, dir?: string, log?: (command: SlashCommand, manager: SlashManager) => void): SlashManager;
}
declare type CommandLookup = SlashCommand[] | SlashCommand | string | string[];
export {};
