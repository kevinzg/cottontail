export interface AnkiResponse<T = any> {
    result: T | null;
    error: string | null;
}

export interface CottontailCard {
    uuid: string;
    name: string;
    front: string;
    back: string;
    reverse: boolean;
    tags: string[];
}

export default class Anki {
    constructor() {}

    private async request<T>(body: any): Promise<AnkiResponse<T>> {
        return window
            .fetch('http://localhost:8765', {
                method: 'POST',
                body: JSON.stringify(body),
                // mode: 'no-cors',
            })
            .then((resp) => resp.json())
            .catch((err) => ({
                result: null,
                error: `unknown error: ${
                    err instanceof Error ? err.toString() : '???'
                }`,
            }));
    }

    async getDecks(): Promise<string[]> {
        const response = await this.request<string[]>({
            action: 'deckNames',
            version: 6,
        });
        return response.result || [];
    }

    async requestPermission(): Promise<string[]> {
        const response = await this.request<string[]>({
            action: 'requestPermission',
            version: 6,
        });
        return response.result || [];
    }

    async addNote(card: CottontailCard): Promise<AnkiResponse<number>> {
        return await this.request<any>({
            action: 'addNote',
            version: 6,
            params: {
                note: {
                    deckName: 'Cottontail',
                    modelName: 'Cottontail Card',
                    fields: {
                        Front: card.front,
                        Back: card.back,
                        Name: card.name,
                        'Add Reverse': card.reverse ? '1' : '',
                        UUID: card.uuid,
                    },
                    options: {
                        allowDuplicate: false,
                        duplicateScope: 'deck',
                        duplicateScopeOptions: {
                            deckName: 'Cottontail',
                            checkChildren: false,
                            checkAllModels: false,
                        },
                    },
                    tags: card.tags,
                    audio: [],
                    video: [],
                    picture: [],
                },
            },
        });
    }
}
