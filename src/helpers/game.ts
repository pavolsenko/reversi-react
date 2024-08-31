
import { Fields, FieldType } from '../interfaces/game.ts';

export function getStartGame(): Fields {
    const fields: Fields = [[], [], [], [], [], [], [], []];

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (y === 3 && x === 3) {
                fields[x][y] = {type: FieldType.WHITE};
                continue;
            }

            if (y === 3 && x === 4) {
                fields[x][y] = {type: FieldType.BLACK};
                continue;
            }

            if (y === 4 && x === 3) {
                fields[x][y] = {type: FieldType.BLACK};
                continue;
            }

            if (y === 4 && x === 4) {
                fields[x][y] = {type: FieldType.WHITE};
                continue;
            }

            fields[x][y] = {type: FieldType.EMPTY};
        }
    }

    return fields;
}

export function checkIsGameOver(fields: Fields): boolean {
    const white: number = countWhite(fields);
    const black: number = countBlack(fields);
    return white + black === 64;
}

export function countWhite(fields: Fields): number {
    let white: number = 0;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (fields[x][y].type === FieldType.WHITE) {
                white++;
            }
        }
    }

    return white;
}

export function countBlack(fields: Fields): number {
    let black: number = 0;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (fields[x][y].type === FieldType.BLACK) {
                black++;
            }
        }
    }

    return black;
}
