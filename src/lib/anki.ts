// See: https://foosoft.net/projects/anki-connect/index.html

interface AnkiOkResponse<T = any> {
    result: T;
    error?: null;
}

interface AnkiErrorResponse {
    result: null;
    error: string;
}

export type AnkiResponse<T> = AnkiOkResponse<T> | AnkiErrorResponse;

export interface AnkiNote {
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

export interface AnkiPermissionGrantedResponse {
    permission: 'granted';
    version: number;
    requireApiKey: boolean;
}

export interface AnkiPermissionDeniedResponse {
    permission: 'denied';
}

type AnkiPermissionResponse =
    | AnkiPermissionGrantedResponse
    | AnkiPermissionDeniedResponse;

export default class Anki {
    async addNote(note: AnkiNote): Promise<number> {
        return await this.request<any>({
            action: 'addNote',
            version: 6,
            params: {
                note,
            },
        });
    }

    async requestPermission(): Promise<AnkiPermissionResponse> {
        return await this.request<AnkiPermissionResponse>({
            action: 'requestPermission',
            version: 6,
        });
    }

    async getDecks(): Promise<string[]> {
        return await this.request<string[]>({
            action: 'deckNames',
            version: 6,
        });
    }

    async createDeck(deck: string): Promise<number> {
        return await this.request<number>({
            action: 'createDeck',
            version: 6,
            params: {
                deck,
            },
        });
    }

    // TODO: handle timeouts?
    private async request<T>(body: any): Promise<T> {
        return window
            .fetch('http://localhost:8765', {
                method: 'POST',
                body: JSON.stringify(body),
                mode: 'cors',
            })
            .then((resp) => resp.json())
            .then((data: AnkiResponse<T>) => {
                if (data.error != null) {
                    throw new Error('Anki connect error: ' + data.error);
                }
                return data.result;
            })
            .catch((err) => {
                console.error('Anki error', err);
                throw err;
            });
    }
}
