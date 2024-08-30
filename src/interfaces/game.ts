import * as Immutable from 'immutable';

export interface Game {
    fields: Fields;
}

export type Fields = Immutable.Map<number, Immutable.Map<number, Field>>;

export interface Field {
    type: FieldType;
}

export enum FieldType {
    EMPTY = 'empty',
    BLACK = 'black',
    WHITE = 'white',
}
