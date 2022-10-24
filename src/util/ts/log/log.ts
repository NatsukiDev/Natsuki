import {Client} from "discord.js";

function color() {};

export const log = (client: Client) => (log: any | LogOptionsObject = "Test Log", options?: LogOptionsObject) => {
    
};

export interface LogOptionsObject {
    message?: any,
    level?: string | number,
    source?: string | {
        text?: string,
        color?: Color
    },
    color?: Color,
    suffix?: string
}

export interface ColorObject {
    type: "hex" | "default",
    color: string
}

export type Color = string | ColorObject;