import {Embed, Client, Message} from "discord.js";

export class Command {

    name: string;
    meta: CommandMeta;
    help: Embed | string;

    constructor(name: string, meta: CommandMeta, help: Embed | string) {
        this.name = name;
        this.meta = meta;
        this.help = help;
    }

}

export class SubCommand {

}

export class TextCommand extends Command {

    private _execute: (client: Client, message: Message, args: string[], cmd: TextCommandCmdArg) => void | any;
    
    subCommandsKey: Map<string, string>;
    subCommands: Map<string, SubCommand>;
    enabled: boolean = true;


    constructor(name: string, meta: CommandMeta, help: Embed | string, execute: (client: Client, message: Message, args: string[], cmd: TextCommandCmdArg) => void | any, subCommands?: SubCommand[]) {
        super(name, meta, help);
        this._execute = execute;
        if (subCommands && Array.isArray(subCommands) && subCommands.length) {
            //
        }
    }

    public execute(client: Client, message: Message, args: string[], cmd: TextCommandCmdArg): void | any {
        if (!this.enabled) {return;} //TODO command return output logging flag
        return this._execute(client, message, args, cmd);
    }

    public toggle(): void {this.enabled = !this.enabled;}
    public enable(): void {this.enabled = true;}
    public disable(): void {this.enabled = false;}

}

export class SlashCommand extends Command {}


export interface CommandMeta {
    category: string,
    description: string,
    syntax: string,
    extra: string | null
}

export interface TextCommandCmdArg {
    msg: string,
    name: string,
    prefix: string,
    args: string[]
}