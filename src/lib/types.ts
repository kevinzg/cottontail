export interface ICard {
    id?: number;
    uuid: string;
    title: string;
    content: {
        text: string; // Plain text
        html: string; // HTML rich text
        json: string; // Tiptap JSON format
    };
    category: string;
    source: {
        url: string;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export type ICardData = Omit<ICard, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>;
