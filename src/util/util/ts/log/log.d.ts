import { Client } from "discord.js";
export declare const log: (client: Client) => (log?: any | LogOptionsObject, options?: LogOptionsObject) => void;
export interface LogOptionsObject {
    message?: any;
    level?: string | number;
    source?: string | {
        text?: string;
        color?: Color;
    };
    color?: Color;
    suffix?: string;
}
export interface ColorObject {
    type: "hex" | "default";
    color: string;
}
export declare type Color = string | ColorObject;
