import { liveQuery } from 'dexie';

import type { IFlashcard, IFlashcardData } from './types';
import Anki, { type AnkiNote } from './anki';
import { Database } from './database';
import { randomUID } from './uid';
import type { Readable } from 'svelte/store';

const db = ((window as any).db = new Database());
const anki = ((window as any).anki = new Anki());

const BASIC_REVERSABLE_CARD = 'Basic (optional reversed card)';
const CLOZE_CARD = 'Cloze';

export async function saveCard(data: { card: IFlashcardData }) {
    const now = new Date();
    const card: IFlashcard = {
        ...data.card,
        uuid: randomUID(now),
        createdAt: now,
        updatedAt: now,
    };
    return db.cards
        .put(card)
        .then((id) => console.log('Card saved with id', id))
        .then(() => syncToAnki(card))
        .catch(console.error); // TODO: Handle errors somewher else
}

// TODO: Take care of race conditions
export async function syncToAnki(card: IFlashcard) {
    ensureAnkiPermission()
        .then(async () => {
            const note = makeAnkiNote(card);
            await ensureAnkiDeckExists(note.deckName);
            return anki.addNote(note);
        })
        .then((ankiId) => {
            console.log('Anki note created for card', card.uuid, ankiId);
            return db.cards.update(card.uuid, {
                ankiId,
                ankiVersion: card.updatedAt,
            });
        });
}

// TODO: Delete from Anki? Have a tombstone instead?
export async function deleteCard(card: IFlashcard) {
    return db.cards.delete(card.uuid);
}

export const allCardsStore: () => Readable<IFlashcard[]> = (() => {
    let cards: Readable<IFlashcard[]>;
    return () => {
        if (cards) return cards;
        cards = liveQuery<IFlashcard[]>(() =>
            db.cards.toCollection().reverse().sortBy('uuid')
        ) as unknown as Readable<IFlashcard[]>;
        return cards;
    };
})();

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

const ensureAnkiPermission = (() => {
    let permissionGranted = false;
    return async () => {
        if (permissionGranted) return;
        anki.requestPermission().then((resp) => {
            console.log('Anki permission response', resp);
            if (resp.permission !== 'granted') {
                throw new Error('Permission not granted');
            }
            permissionGranted = true;
        });
    };
})();

const ensureAnkiDeckExists = (() => {
    let starterDecks: Promise<Set<string>> = anki
        .getDecks()
        .then((decks) => new Set(decks))
        .catch((err) => {
            console.warn('Could not get decks', err);
            return new Set();
        });
    return async (deck: string) => {
        const decks = await starterDecks;
        if (decks.has(deck)) return;
        await anki
            .createDeck(deck)
            .then((id) => console.log('Deck created', deck, id))
            .then(() => decks.add(deck));
        return;
    };
})();
