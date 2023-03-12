import Anki, { type AnkiNote } from './anki';

import { Database } from './database';
import type { IFlashcard, IFlashcardData } from './types';

const db = new Database();
const anki = new Anki();

const BASIC_REVERSABLE_CARD = 'Basic (optional reversed card)';
const CLOZE_CARD = 'Cloze';

export async function saveCard(data: IFlashcardData) {
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
