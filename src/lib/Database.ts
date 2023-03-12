import { Dexie } from 'dexie';

import type { IFlashcard, UUID } from './types';

export class Database extends Dexie {
    cards!: Dexie.Table<IFlashcard, UUID>;

    constructor() {
        super('CottontailDB');

        this.version(1).stores({
            cards: '&uuid',
        });
    }
}
