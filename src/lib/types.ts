export interface ICard {
    id?: number;
    uuid: string;
    title: string;
    content: string;
    category: string;
    source: {
        url: string;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
