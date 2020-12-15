"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
class Pagination {
    constructor(channel, pages, originalMessage, client, message) {
        this.channel = channel;
        this.pages = pages;
        this.originalMessage = message;
        this.client = client;
        this.currentPage = 0;
        if (message) {
            this.message = message;
        }
    }
    ;
    async setPage(page) {
        if (this.pages.length < page + 1) { }
        if (!this.message) {
            let tempm = await this.channel.send("One moment...")
                .catch(() => { this.originalMessage.reply("There seemed to be a problem doing that..."); return this; });
            if (tempm instanceof Pagination) {
                return this;
            }
            else {
                this.message = tempm;
            }
        }
        await this.message.edit(this.pages[page]
            .setFooter(`Natsuki | Page ${page + 1} of ${this.pages.length}`, this.client.user.avatarURL())
            .setTimestamp());
        this.currentPage = page;
        return this;
    }
    ;
    async nextPage() {
        await this.setPage(typeof this.currentPage === "number" ? this.currentPage + 1 == this.pages.length ? this.currentPage : this.currentPage + 1 : 0);
        return this;
    }
    ;
    async prevPage() {
        await this.setPage(typeof this.currentPage === "number" ? this.currentPage === 0 ? 0 : this.currentPage - 1 : this.pages.length - 1);
        return this;
    }
    ;
    addPage(page) {
        this.pages.push(page);
        return this;
    }
    replacePage(index, page) {
        if (index < 0) {
            throw new RangeError("replacePage() param 'index' must be a value greater than 0");
        }
        if (index > this.pages.length - 1) {
            throw new RangeError("replacePage() param 'index' must be a value corresponding to an index that already exists in this instance's pages.");
        }
        this.pages[index] = page;
        return this;
    }
}
exports.Pagination = Pagination;
