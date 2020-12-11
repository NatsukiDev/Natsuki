"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = exports.Pagination = void 0;
const discord_js_1 = require("discord.js");
class Pagination {
    constructor(title, pages, zeroPage, client, message, activationMessage, timeout, description, pageTemplate) {
        this.currentpos = 0;
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
            : new discord_js_1.MessageEmbed()
                .setDescription(this.description)
                .addField('Navigation', `Click or tap the arrows below this message to navigate through the pages!\n\n*This menu will timeout in ${this.timeout}ms.`)
                .setColor('c375f0')
                .setFooter('Natsuki', this.client.user.avatarURL())
                .setTimestamp();
    }
    ;
    addPage(page) {
        this.pages.push(page);
        return this;
    }
    ;
    render(pos) {
        let page = this.pages[this.currentpos];
        let pageEmbed = new discord_js_1.MessageEmbed()
            .setTitle(`${this.title} -> ${page.title}`)
            .setDescription(`${this.pageTemplate.description ? this.pageTemplate.description : this.description}\n\n${page.description}`)
            .setColor(this.pageTemplate.hexColor ? this.pageTemplate.hexColor : 'c375f0')
            .setFooter(this.pageTemplate.footer ? `${this.pageTemplate.footer.text} | Page ${this.currentpos + 1} of ${this.pages.length}` : `Natsuki | Page ${this.currentpos + 1} of ${this.pages.length}`)
            .setTimestamp();
        let item;
        for (item of page.items) {
            pageEmbed.addField(item.title, item.text);
        }
        if (this.pageTemplate.thumbnail) {
            pageEmbed.setThumbnail(this.pageTemplate.thumbnail.url);
        }
        this.message.edit(pageEmbed);
        return this;
    }
    ;
    nextPage() {
        return this.render(this.currentpos < (this.pages.length - 1) ? this.currentpos + 1 : this.currentpos);
    }
    ;
    prevPage() {
        return this.render(this.currentpos > 0 ? this.currentpos - 1 : this.currentpos);
    }
    ;
    destroy(delmsg, fmsg) {
        return this;
    }
    ;
    resetTimeout(newTimeout) {
        return this;
    }
    ;
    init() {
        return this;
    }
    ;
}
exports.Pagination = Pagination;
class Page {
    constructor(title, items, description) {
        this.items = [];
        this.title = title;
        this.items = items;
        this.description = description;
    }
    ;
    addItem(item) {
        this.items.push(item);
        return this;
    }
    ;
}
exports.Page = Page;
