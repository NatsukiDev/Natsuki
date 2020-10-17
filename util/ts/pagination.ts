import {MessageEmbed, Message, Client} from 'discord.js';

import wait = require('../../util/wait');

export class Pagination {
    title: string;
    pages: Page[];
    zeroPage: Page | MessageEmbed;
    pageTemplate: MessageEmbed;
    message: Message;
    timeout: Number;
    description: string;
    activationMessage: Message;
    client: Client;
    currentpos: number = 0;



    constructor (title: string, pages: Page[], zeroPage: Page | MessageEmbed, client: Client, message: Message, activationMessage: Message, timeout: number, description?: string, pageTemplate?: MessageEmbed) {
        this.title = title;
        this.pages = pages;
        this.zeroPage = zeroPage;
        this.message = message;
        this.timeout = timeout;
        this.activationMessage = activationMessage;
        this.client = client;

        this.description = description ? description : `Requested by ${activationMessage.guild ? activationMessage.member.displayName : activationMessage.author.username}.`;

        this.pageTemplate = pageTemplate
            ? pageTemplate
            : new MessageEmbed()
            .setDescription(this.description)
            .addField('Navigation', `Click or tap the arrows below this message to navigate through the pages!\n\n*This menu will timeout in ${this.timeout}ms.`)
            .setColor('c375f0')
            .setFooter('Natsuki', this.client.user.avatarURL())
            .setTimestamp();
    };

    

    public addPage(page: Page): Pagination {
        this.pages.push(page);
        return this;
    };

    public render(pos: number): Pagination {
        let page = this.pages[this.currentpos];
        let pageEmbed: MessageEmbed = new MessageEmbed()
            .setTitle(`${this.title} -> ${page.title}`)
            .setDescription(`${this.pageTemplate.description ? this.pageTemplate.description : this.description}\n\n${page.description}`)
            .setColor(this.pageTemplate.hexColor ? this.pageTemplate.hexColor : 'c375f0')
            .setFooter(this.pageTemplate.footer ? `${this.pageTemplate.footer.text} | Page ${this.currentpos + 1} of ${this.pages.length}` : `Natsuki | Page ${this.currentpos + 1} of ${this.pages.length}`)
            .setTimestamp();
        let item: PageItem; for (item of page.items) {pageEmbed.addField(item.title, item.text);}
        if (this.pageTemplate.thumbnail) {pageEmbed.setThumbnail(this.pageTemplate.thumbnail.url);}
        
        this.message.edit(pageEmbed);

        return this;
    };

    public nextPage(): Pagination {
        return this.render(this.currentpos < (this.pages.length - 1) ? this.currentpos + 1 : this.currentpos);
    };

    public prevPage(): Pagination {
        return this.render(this.currentpos > 0 ? this.currentpos - 1 : this.currentpos);
    };

    public destroy(delmsg?: boolean, fmsg?: Message): Pagination {
        return this;
    };

    public resetTimeout(newTimeout?: number): Pagination {
        return this;
    };

    public init(): Pagination {
        return this;
    };

}



export class Page {
    items: PageItem[] = [];
    title: string;
    description: string;



    constructor(title: string, items: PageItem[], description?: string) {
        this.title = title;
        this.items = items;
        this.description = description;
    };



    public addItem(item: PageItem): Page {
        this.items.push(item);
        return this;
    };

}

interface PageItem {
    title: string,
    text: string
}