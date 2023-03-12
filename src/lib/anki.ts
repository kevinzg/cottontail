// See: https://foosoft.net/projects/anki-connect/index.html

interface AnkiOkResponse<T = any> {
    result: T;
    error: null;
}

interface AnkiErrorResponse {
    result: null;
    error: string;
}

export type AnkiResponse<T> = AnkiOkResponse<T> | AnkiErrorResponse;

export interface AnkiModel {
    deckName: string;
    modelName: string;
    fields: Record<string, string>;
    options: {
        allowDuplicate: boolean;
        duplicateScope: 'deck' | null;
        duplicateScopeOptions: {
            deckName?: string;
            checkChildren: boolean;
            checkAllModels: boolean;
        };
    };
    tags: string[];
    // audio: []any;
    // video: []any;
    // picture: []any;
}

export default class Anki {
    async getDecks(): Promise<string[]> {
        const response = await this.request<string[]>({
            action: 'deckNames',
            version: 6,
        });
        return response.result || [];
    }

    async addNote(note: AnkiModel): Promise<AnkiResponse<number>> {
        return await this.request<any>({
            action: 'addNote',
            version: 6,
            params: {
                note,
            },
        });
    }

    async requestPermission(): Promise<string[]> {
        const response = await this.request<string[]>({
            action: 'requestPermission',
            version: 6,
        });
        return response.result || [];
    }

    private async request<T>(body: any): Promise<AnkiResponse<T>> {
        return window
            .fetch('http://localhost:8765', {
                method: 'POST',
                body: JSON.stringify(body),
            })
            .then((resp) => resp.json())
            .catch((err) => {
                console.error('Anki error', err);
                return {
                    result: null,
                    error: '' + err,
                };
            });
    }
}
