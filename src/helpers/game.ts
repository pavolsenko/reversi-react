import { CORNERS, DIRECTIONS } from '@/constants/game';
import {
    countItemsOnBoard,
    evaluateBoard,
    evaluateBoardAdvanced,
} from '@/helpers/board';
import {
    BLACK,
    Board,
    Difficulty,
    EMPTY,
    Field,
    Move,
    Player,
    WHITE,
} from '@/interfaces/game';

function getOpponent(player: Player): Player {
    return player === BLACK ? WHITE : BLACK;
}

export function isValidMove(board: Board, move: Move, player: Player): boolean {
    if (board[move.x][move.y] !== EMPTY) {
        return false;
    }

    const opponent = getOpponent(player);

    for (const [dx, dy] of DIRECTIONS) {
        let x = move.x + dx;
        let y = move.y + dy;
        let seenOpponent = false;

        while (x >= 0 && y >= 0 && x < 8 && y < 8) {
            const current = board[x][y];
            if (current === opponent) {
                seenOpponent = true;
            } else if (current === player && seenOpponent) {
                return true;
            } else {
                break;
            }
            x += dx;
            y += dy;
        }
    }

    return false;
}

export function getValidMovesForPlayer(board: Board, player: Player): Move[] {
    const moves: Move[] = [];
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (isValidMove(board, { x, y }, player)) {
                moves.push({ x, y });
            }
        }
    }
    return moves;
}

export function applyMoveForPlayer(
    board: Board,
    player: Player,
    move: Move,
): Board {
    const newBoard = board.map((row: Field[]): Field[] => row.slice());
    const opponent = getOpponent(player);

    newBoard[move.x][move.y] = player;

    for (const [dx, dy] of DIRECTIONS) {
        let x = move.x + dx;
        let y = move.y + dy;
        const toFlip: [number, number][] = [];

        while (x >= 0 && y >= 0 && x < 8 && y < 8) {
            const current = newBoard[x][y];
            if (current === opponent) {
                toFlip.push([x, y]);
            } else if (current === player) {
                toFlip.forEach(([fx, fy]) => {
                    newBoard[fx][fy] = player;
                });
                break;
            } else {
                break;
            }
            x += dx;
            y += dy;
        }
    }

    return newBoard;
}
export function orderMoves(
    moves: Move[],
    board: Board,
    player: Player,
    difficulty: Difficulty,
): Move[] {
    const isCorner = (move: Move) =>
        CORNERS.some((c) => c.x === move.x && c.y === move.y);

    return moves.sort((a, b) => {
        if (isCorner(a)) {
            return -1;
        }
        if (isCorner(b)) {
            return 1;
        }

        let scoreA: number;
        let scoreB: number;

        if (difficulty === Difficulty.HARD) {
            scoreA = evaluateBoardAdvanced(
                applyMoveForPlayer(board, player, a),
                player,
            );
            scoreB = evaluateBoardAdvanced(
                applyMoveForPlayer(board, player, b),
                player,
            );
        } else {
            scoreA = evaluateBoard(
                applyMoveForPlayer(board, player, a),
                player,
            );
            scoreB = evaluateBoard(
                applyMoveForPlayer(board, player, b),
                player,
            );
        }
        return scoreB - scoreA;
    });
}

const transpositionTable = new Map<string, number>();

function serializeBoard(board: Board): string {
    return board.flat().join('');
}

export function minmax(
    board: Board,
    depth: number,
    player: Player,
    alpha: number,
    beta: number,
): number {
    const key = serializeBoard(board) + player;
    if (transpositionTable.has(key)) {
        return transpositionTable.get(key)!;
    }
    const opponent = getOpponent(player);
    const validMoves = getValidMovesForPlayer(board, player);

    if (depth === 0 || validMoves.length === 0) {
        return quiescenceSearch(board, player, alpha, beta);
    }

    if (validMoves.length === 1) {
        const newBoard = applyMoveForPlayer(board, player, validMoves[0]);
        return -minmax(newBoard, depth - 1, getOpponent(player), -beta, -alpha);
    }

    if (player === BLACK) {
        let maxEval = -Infinity;
        for (const move of validMoves) {
            const evalScore = minmax(
                applyMoveForPlayer(board, player, move),
                depth - 1,
                opponent,
                alpha,
                beta,
            );
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) {
                break;
            }
        }

        transpositionTable.set(key, maxEval);
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of validMoves) {
            const evalScore = minmax(
                applyMoveForPlayer(board, player, move),
                depth - 1,
                opponent,
                alpha,
                beta,
            );
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) {
                break;
            }
        }

        transpositionTable.set(key, minEval);
        return minEval;
    }
}

function isQuietPosition(board: Board, move: Move, player: Player): boolean {
    const opponent = getOpponent(player);
    return !DIRECTIONS.some(([dx, dy]) => {
        const x = move.x + dx;
        const y = move.y + dy;
        return x >= 0 && y >= 0 && x < 8 && y < 8 && board[x][y] === opponent;
    });
}

function quiescenceSearch(
    board: Board,
    player: Player,
    alpha: number,
    beta: number,
): number {
    const evalScore = countItemsOnBoard(board, player);
    if (evalScore >= beta) {
        return beta;
    }
    if (evalScore > alpha) {
        alpha = evalScore;
    }

    const noisyMoves = getValidMovesForPlayer(board, player).filter(
        (move: Move) => !isQuietPosition(board, move, player),
    );

    for (const move of noisyMoves) {
        const newBoard = applyMoveForPlayer(board, player, move);
        const score = -quiescenceSearch(
            newBoard,
            getOpponent(player),
            -beta,
            -alpha,
        );

        if (score >= beta) {
            return beta;
        }
        if (score > alpha) {
            alpha = score;
        }
    }

    return alpha;
}

export async function minmaxParallel(
    board: Board,
    depth: number,
    player: Player,
    alpha: number,
    beta: number,
): Promise<number> {
    const opponent = getOpponent(player);
    const validMoves = getValidMovesForPlayer(board, player);

    if (depth === 0 || validMoves.length === 0) {
        return quiescenceSearch(board, player, alpha, beta);
    }

    const promises = validMoves.map((move) => {
        const worker = new Worker(
            new URL('./minmax.worker.ts', import.meta.url),
            {
                type: 'module',
            },
        );

        const newBoard = applyMoveForPlayer(board, player, move);

        return new Promise<number>((resolve, reject) => {
            worker.onmessage = ({ data }) => {
                resolve(data);
                worker.terminate();
            };
            worker.onerror = (err) => {
                reject(err);
                worker.terminate();
            };
            worker.postMessage({
                board: newBoard,
                depth: depth - 1,
                player: opponent,
                alpha,
                beta,
            });
        });
    });

    const scores = await Promise.all(promises);
    return player === BLACK ? Math.max(...scores) : Math.min(...scores);
}

export async function findBestMoveForPlayer(
    board: Board,
    player: Player,
    depth: number,
    difficulty: Difficulty,
): Promise<Move | null> {
    const opponent = getOpponent(player);
    let bestMove: Move | null = null;
    let bestScore = -Infinity;

    const orderedMoves = orderMoves(
        getValidMovesForPlayer(board, player),
        board,
        player,
        difficulty,
    );

    for (const move of orderedMoves) {
        const newBoard = applyMoveForPlayer(board, player, move);
        const score = -(await minmaxParallel(
            newBoard,
            depth - 1,
            opponent,
            -Infinity,
            Infinity,
        ));

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
}

export function getDifficultyDepth(
    difficulty: Difficulty,
    numberOfMoves: number,
): number {
    const EARLY = 16;
    const MID = 32;

    const mapping = {
        [Difficulty.EASY]: { early: 2, mid: 2, late: 4 },
        [Difficulty.MEDIUM]: { early: 3, mid: 2, late: 6 },
        [Difficulty.HARD]: { early: 5, mid: 6, late: 8 },
    };

    const stage =
        numberOfMoves < EARLY ? 'early' : numberOfMoves < MID ? 'mid' : 'late';
    const baseDepth = mapping[difficulty][stage];
    const dynamicBoost = Math.max(
        0,
        Math.min(2, Math.floor((64 - numberOfMoves) / 10)),
    );

    return baseDepth + dynamicBoost;
}
