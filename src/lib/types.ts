export type UUID = string;

export interface IFlashcard {
    uuid: UUID;
    kind: 'basic' | 'reverse' | 'cloze';
    front: string;
    back: string;
    deck: string;
    source: {
        url: string;
        title: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export type IFlashcardData = Omit<
    IFlashcard,
    'uuid' | 'createdAt' | 'updatedAt'
>;

// Messages between content script and background script
export interface SaveCardMessage {
    type: 'save-card';
    payload: {
        card: IFlashcardData;
    };
}

export type Message = SaveCardMessage;
export type MessageTypes = Message['type'];
