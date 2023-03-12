import browser from 'webextension-polyfill';
import * as service from './lib/service';

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
        if (browser.runtime.lastError) {
            console.error(browser.runtime.lastError);
        }
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

/**
 * Listens to messages sent by the content script.
 */
browser.runtime.onMessage.addListener((message) => {
    switch (message.type) {
        case 'save-card':
            return service.saveCard(message.payload);
        default:
            console.log('Unhandled message type', message);
    }
});
