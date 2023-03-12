import { Dexie } from 'dexie';

import type { IFlashcard } from './types';

export class Database extends Dexie {
    cards!: Dexie.Table<IFlashcard, IFlashcard['uuid']>;

    constructor() {
        super('CottontailDB');

        this.version(1).stores({
            cards: '&uuid,ankiId',
        });
    }
}
