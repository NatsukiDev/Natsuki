import { REST } from '@discordjs/rest';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
export declare class SlashCommand {
    response: (client: Client, interaction: CommandInteraction) => any;
    command: SlashCommandBuilder;
    registerMode: RegisterMode;
    enabled: boolean;
    readonly name: string;
    readonly client: Client;
    readonly rest: REST;
    constructor(name: string, client: Client, command: SlashCommandBuilder, response: (client: Client, interaction: CommandInteraction) => any, registerMode?: RegisterMode);
    register(forceMode?: RegisterMode): Promise<unknown>;
    registerGlobally(): Promise<unknown>;
    registerToServer(serverIDs: string[]): Promise<unknown>;
    setResponse(newResponse: (client: Client, interaction: CommandInteraction) => any): SlashCommand;
    disable(): Promise<void>;
    setDefaultRegisterMode(mode: RegisterMode): SlashCommand;
    respond(client: Client, interaction: CommandInteraction): Promise<any>;
    setCommand(newCommand: SlashCommandBuilder): SlashCommand;
}
export declare type RegisterMode = {
    serverIDs: string[];
    global?: boolean;
} | "global";
