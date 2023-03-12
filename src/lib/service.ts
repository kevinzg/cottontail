import Anki, { type AnkiNote } from './anki';

import { Database } from './database';
import type { IFlashcard, IFlashcardData } from './types';
import { randomUID } from './uid';

const db = new Database();
const anki = new Anki();

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
        .then(() => ensureAnkiPermission())
        .then(async () => {
            const note = makeAnkiNote(card);
            await ensureAnkiDeckExists(note.deckName);
            return anki.addNote(note);
        })
        .then((ankiId) => {
            console.log('Anki note created for card', card.uuid, ankiId);
            return db.cards.update(card.uuid, {
                ankiId,
            });
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
            .then((id) => console.log('Deck created', deck, id));
        return;
    };
})();
