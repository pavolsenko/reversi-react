import { BLACK, EMPTY, Fields, LegalMove, Player, WHITE } from '../interfaces/game';

export function getStartGame(): Fields {
    const fields: Fields = [[], [], [], [], [], [], [], []];

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (y === 3 && x === 3) {
                fields[x][y] = {type: WHITE};
                continue;
            }

            if (y === 3 && x === 4) {
                fields[x][y] = {type: BLACK};
                continue;
            }

            if (y === 4 && x === 3) {
                fields[x][y] = {type: BLACK};
                continue;
            }

            if (y === 4 && x === 4) {
                fields[x][y] = {type: WHITE};
                continue;
            }

            fields[x][y] = {type: EMPTY};
        }
    }

    return fields;
}

export function checkIsGameOver(fields: Fields, whiteLegalMoves: LegalMove[], blackLegalMoves: LegalMove[]): boolean {
    const white: number = countWhite(fields);
    const black: number = countBlack(fields);
    return white + black === 64 || (whiteLegalMoves.length === 0 && blackLegalMoves.length === 0);
}

export function countWhite(fields: Fields): number {
    let white: number = 0;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (fields[x][y].type === WHITE) {
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
            if (fields[x][y].type === BLACK) {
                black++;
            }
        }
    }

    return black;
}

export function getLegalMoves(fields: Fields, player: Player): LegalMove[] {
    const result: LegalMove[] = [];

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (fields[x][y].type !== EMPTY) {
                continue;
            }

            if (y < 6) {
                const legalMoveSouth = getLegalMoveSouth(fields, player, x, y);
                if (legalMoveSouth) {
                    result.push(legalMoveSouth);
                }
            }

        }
    }

    return result;
}

export function getLegalMoveSouth(fields: Fields, player: Player, x: number, y: number): LegalMove | undefined {
    if (fields[x][y + 1].type !== player && fields[x][y + 1].type !== EMPTY) {
        return;
    }

    let southCounter = y + 2;
    while (southCounter < 8) {
        if (fields[x][southCounter]?.type === player) {
            return {
                coordinates: {x, y},
                direction: 'S',
            };
        }
        southCounter++;
    }
}
