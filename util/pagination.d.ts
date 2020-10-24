import { MessageEmbed, Message, Client } from 'discord.js';
export declare class Pagination {
    title: string;
    pages: Page[];
    zeroPage: Page | MessageEmbed;
    pageTemplate: MessageEmbed;
    message: Message;
    timeout: Number;
    description: string;
    activationMessage: Message;
    client: Client;
    currentpos: number;
    constructor(title: string, pages: Page[], zeroPage: Page | MessageEmbed, client: Client, message: Message, activationMessage: Message, timeout: number, description?: string, pageTemplate?: MessageEmbed);
    addPage(page: Page): Pagination;
    render(pos: number): Pagination;
    nextPage(): Pagination;
    prevPage(): Pagination;
    destroy(delmsg?: boolean, fmsg?: Message): Pagination;
    resetTimeout(newTimeout?: number): Pagination;
    init(): Pagination;
}
export declare class Page {
    items: PageItem[];
    title: string;
    description: string;
    constructor(title: string, items: PageItem[], description?: string);
    addItem(item: PageItem): Page;
}
interface PageItem {
    title: string;
    text: string;
}
export {};
