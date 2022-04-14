import browser from 'webextension-polyfill';

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
