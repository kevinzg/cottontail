import browser from 'webextension-polyfill';

import { Database } from './lib/Database';
import type { ICard, ICardData } from './lib/types';

browser.contextMenus.create(
    {
        id: 'menuItemCreateCard',
        title: browser.i18n.getMessage('menuItemCreateCard'),
        contexts: ['all'],
        onclick: (_ev, tab) => {
            executeContentScript(tab);
        },
    },
    () => {
        browser.runtime.lastError && console.error(browser.runtime.lastError);
    }
);

browser.browserAction.onClicked.addListener((tab) => executeContentScript(tab));

function executeContentScript(tab: browser.Tabs.Tab) {
    browser.tabs
        .executeScript(tab.id, {
            file: 'content.js',
        })
        .catch(console.error);
}

const db = new Database();

browser.runtime.onMessage.addListener(async (message) => {
    const data: ICardData = message.card;
    const now = new Date();
    const card: ICard = {
        ...data,
        // @ts-ignore
        uuid: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
    };
    const resp = await db.cards.add(card).catch(console.error);
    return resp;
});
