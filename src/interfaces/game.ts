export interface Game {
    fields: Fields;
}

export type Fields = Field[][];

export interface Field {
    type: FieldType;
}

export enum FieldType {
    EMPTY = 'empty',
    BLACK = 'black',
    WHITE = 'white',
}
