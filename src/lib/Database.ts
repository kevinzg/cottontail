import Dexie from 'dexie';

import type { ICard } from './types';

export class Database extends Dexie {
    cards!: Dexie.Table<ICard, number>;

    constructor() {
        super('CottontailDB');

        this.version(1).stores({
            cards: '++id, uuid', // TODO: Do I want two ids?
        });
    }
}
