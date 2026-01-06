import { BLACK, Board, Player, WHITE } from '@/interfaces/game';

enum TranspositionTableFlag {
    EXACT,
    LOWERBOUND,
    UPPERBOUND,
}

type TranspositionTableEntry = {
    value: number;
    depth: number;
    flag: TranspositionTableFlag;
};

export const transpositionTable = new Map<string, TranspositionTableEntry>();

export function transpositionTableKey(board: Board, player: Player): string {
    let hash = 0;
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            hash *= 3;
            const field = board[x][y];
            if (field === BLACK) {
                hash += 1;
            } else if (field === WHITE) {
                hash += 2;
            }
        }
    }

    return `${hash}_${player}`;
}

export function transpositionTableLookup(
    board: Board,
    player: Player,
    depth: number,
    alpha: number,
    beta: number,
): number | null {
    const key = transpositionTableKey(board, player);
    const entry = transpositionTable.get(key);
    if (!entry || entry.depth < depth) {
        return null;
    }

    const { value, flag } = entry;

    if (flag === TranspositionTableFlag.EXACT) {
        return value;
    }
    if (flag === TranspositionTableFlag.LOWERBOUND && value >= beta) {
        return value;
    }
    if (flag === TranspositionTableFlag.UPPERBOUND && value <= alpha) {
        return value;
    }

    return null;
}

export function transpositionTableStore(
    board: Board,
    player: Player,
    depth: number,
    value: number,
    alphaOrig: number,
    beta: number,
): void {
    const key = transpositionTableKey(board, player);

    let flag: TranspositionTableFlag;
    if (value <= alphaOrig) {
        flag = TranspositionTableFlag.UPPERBOUND;
    } else if (value >= beta) {
        flag = TranspositionTableFlag.LOWERBOUND;
    } else {
        flag = TranspositionTableFlag.EXACT;
    }

    const existing = transpositionTable.get(key);
    if (!existing || existing.depth <= depth) {
        transpositionTable.set(key, { value, depth, flag });
    }
}
