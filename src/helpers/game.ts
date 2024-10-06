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

            const legalMoveNorth = getLegalMoveNorth(fields, player, x, y);
            if (legalMoveNorth) {
                result.push(legalMoveNorth);
            }

            const legalMoveNorthEast = getLegalMoveNorthEast(fields, player, x, y);
            if (legalMoveNorthEast) {
                result.push(legalMoveNorthEast);
            }

            const legalMoveEast = getLegalMoveEast(fields, player, x, y);
            if (legalMoveEast) {
                result.push(legalMoveEast);
            }

            const legalMoveSouthEast = getLegalMoveSouthEast(fields, player, x, y);
            if (legalMoveSouthEast) {
                result.push(legalMoveSouthEast);
            }

            const legalMoveSouth = getLegalMoveSouth(fields, player, x, y);
            if (legalMoveSouth) {
                result.push(legalMoveSouth);
            }

            const legalMoveSouthWest = getLegalMoveSouthWest(fields, player, x, y);
            if (legalMoveSouthWest) {
                result.push(legalMoveSouthWest);
            }


            const legalMoveWest = getLegalMoveWest(fields, player, x, y);
            if (legalMoveWest) {
                result.push(legalMoveWest);
            }

            const legalMoveNorthWest = getLegalMoveNorthWest(fields, player, x, y);
            if (legalMoveNorthWest) {
                result.push(legalMoveNorthWest);
            }
        }
    }

    return result;
}

export function getLegalMoveNorth(fields: Fields, player: Player, x: number, y: number): LegalMove | null {
    if (y < 2) {
        return null;
    }

    if (fields[x][y - 1].type === player || fields[x][y - 1].type === EMPTY) {
        return null;
    }

    let counterY = y - 2;
    while (counterY >= 0) {
        if (fields[x][counterY].type === EMPTY) {
            return null;
        }

        if (fields[x][counterY].type === player) {
            return {
                coordinates: { x, y },
                direction: 'N',
            };
        }
        counterY--;
    }

    return null;
}

export function getLegalMoveNorthEast(fields: Fields, player: Player, x: number, y: number): LegalMove | null {
    if (y < 2 || x > 5) {
        return null;
    }

    if (fields[x + 1][y - 1].type === player || fields[x + 1][y - 1].type === EMPTY) {
        return null;
    }

    let counterX = x + 2;
    let counterY = y - 2;
    while (counterX < 8 && counterY >= 0) {
        if (fields[counterX][counterY].type === EMPTY) {
            return null;
        }

        if (fields[counterX][counterY].type === player) {
            return {
                coordinates: { x, y },
                direction: 'NE',
            };
        }
        counterX++;
        counterY--;
    }

    return null;
}

export function getLegalMoveEast(fields: Fields, player: Player, x: number, y: number): LegalMove | null {
    if (x > 5) {
        return null;
    }

    if (fields[x + 1][y].type === player || fields[x + 1][y].type === EMPTY) {
        return null;
    }

    let counterX = x + 2;
    while (counterX < 8) {
        if (fields[counterX][y].type === EMPTY) {
            return null;
        }

        if (fields[counterX][y].type === player) {
            return {
                coordinates: { x, y },
                direction: 'E',
            };
        }
        counterX++;
    }

    return null;
}

export function getLegalMoveSouthEast(fields: Fields, player: Player, x: number, y: number): LegalMove | null {
    if (x > 5 || y > 5) {
        return null;
    }

    if (fields[x + 1][y + 1].type === player || fields[x + 1][y + 1].type === EMPTY) {
        return null;
    }

    let counterX = x + 2;
    let counterY = y + 2;
    while (counterX < 8 && counterY < 8) {
        if (fields[counterX][counterY].type === EMPTY) {
            return null;
        }

        if (fields[counterX][counterY].type === player) {
            return {
                coordinates: { x, y },
                direction: 'SE',
            };
        }
        counterX++;
        counterY++;
    }

    return null;
}

export function getLegalMoveSouth(fields: Fields, player: Player, x: number, y: number): LegalMove | null {
    if (y > 5) {
        return null;
    }

    if (fields[x][y + 1].type === player || fields[x][y + 1].type === EMPTY) {
        return null;
    }

    let counterY = y + 2;
    while (counterY < 8) {
        if (fields[x][counterY].type === EMPTY) {
            return null;
        }

        if (fields[x][counterY].type === player) {
            return {
                coordinates: { x, y },
                direction: 'S',
            };
        }
        counterY++;
    }

    return null;
}

export function getLegalMoveSouthWest(fields: Fields, player: Player, x: number, y: number): LegalMove | null {
    if (x < 2 ||  y > 5) {
        return null;
    }

    if (fields[x - 1][y + 1].type === player || fields[x - 1][y + 1].type === EMPTY) {
        return null;
    }

    let counterX = x - 2;
    let counterY = y + 2;
    while (counterX >= 0 && counterY < 8) {
        if (fields[counterX][counterY].type === EMPTY) {
            return null;
        }

        if (fields[counterX][counterY].type === player) {
            return {
                coordinates: { x, y },
                direction: 'SW',
            };
        }
        counterX--;
        counterY++;
    }

    return null;
}

export function getLegalMoveWest(fields: Fields, player: Player, x: number, y: number): LegalMove | null {
    if (x < 2) {
        return null;
    }

    if (fields[x - 1][y].type === player || fields[x - 1][y].type === EMPTY) {
        return null;
    }

    let counterX = x - 2;
    while (counterX >= 0) {
        if (fields[counterX][y].type === EMPTY) {
            return null;
        }

        if (fields[counterX][y].type === player) {
            return {
                coordinates: { x, y },
                direction: 'W',
            };
        }
        counterX--;
    }

    return null;
}

export function getLegalMoveNorthWest(fields: Fields, player: Player, x: number, y: number): LegalMove | null {
    if (x < 2 || y < 2) {
        return null;
    }

    if (fields[x - 1][y - 1].type === player || fields[x - 1][y - 1].type === EMPTY) {
        return null;
    }

    let counterX = x - 2;
    let counterY = y - 2;
    while (counterX >= 0 && counterY >= 0) {
        if (fields[counterX][counterY].type === EMPTY) {
            return null;
        }

        if (fields[counterX][counterY].type === player) {
            return {
                coordinates: { x, y },
                direction: 'NW',
            };
        }
        counterX--;
        counterY--;
    }

    return null;
}
