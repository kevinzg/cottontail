import browser from 'webextension-polyfill';
import Anki, { type AnkiNote } from './lib/anki';

import { Database } from './lib/Database';
import type { IFlashcard, IFlashcardData } from './lib/types';

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

const db = new Database();
const anki = new Anki();

/**
 * Listens to messages sent by the content script
 */
browser.runtime.onMessage.addListener((message) => {
    switch (message.type) {
        case 'save-card':
            return saveCard(message.payload);
        default:
            console.log('Unhandled message type', message);
    }
});

const BASIC_REVERSABLE_CARD = 'Basic (optional reversed card)';
const CLOZE_CARD = 'Cloze';

async function saveCard(data: IFlashcardData) {
    const now = new Date();
    const card: IFlashcard = {
        ...data,
        uuid: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
    };
    return db.cards
        .put(card)
        .then((id) => {
            console.log('Card saved with id', id);
            return anki.addNote(makeAnkiNote(card));
        })
        .then((resp) => {
            if (resp.error !== null) {
                throw new Error('Anki card failed to save: ' + resp.error);
            }
            const ankiId = resp.result;
            console.log('Anki response for card', card.uuid, ankiId);
        })
        .catch(console.error);
}

function makeAnkiNote(card: IFlashcard): AnkiNote {
    const { modelName, fields } = getFields(card);
    return {
        deckName: `CT::${card.deck}`,
        modelName,
        fields,
        options: {
            allowDuplicate: false,
            duplicateScope: 'deck',
            duplicateScopeOptions: {
                checkChildren: false,
                checkAllModels: false,
            },
        },
        tags: ['cottontail'],
    };
}

function getFields(card: IFlashcard): Pick<AnkiNote, 'modelName' | 'fields'> {
    switch (card.kind) {
        case 'basic':
            return {
                modelName: BASIC_REVERSABLE_CARD,
                fields: {
                    Front: card.front,
                    Back: card.back,
                    'Add Reverse': '',
                },
            };
        case 'reverse':
            return {
                modelName: BASIC_REVERSABLE_CARD,
                fields: {
                    Front: card.front,
                    Back: card.back,
                    'Add Reverse': '1',
                },
            };
        case 'cloze':
            return {
                modelName: CLOZE_CARD,
                fields: {
                    Text: card.front,
                    Extra: card.back,
                },
            };
    }
}

// const ensurePermission = (() => {
//     let permissionGranted = false;
//     return () => {
//         if (permissionGranted) return;
//         anki.requestPermission()
//         .then((resp) => {
//             if ()
//             permissionGranted = true;
//         })
//     };
// })
