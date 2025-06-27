import { BOARD_WEIGHTS, CORNERS, DIRECTIONS } from '@/constants/game';
import {
    BLACK,
    Board,
    Difficulty,
    EMPTY,
    Field,
    MinMaxWorkerResult,
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
        let x: number = move.x + dx;
        let y: number = move.y + dy;
        let seenOpponent: boolean = false;

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
    const newBoard: Board = board.map((row: Field[]): Field[] => row.slice());
    const opponent: Player = getOpponent(player);
    newBoard[move.x][move.y] = player;

    for (const [dx, dy] of DIRECTIONS) {
        let x: number = move.x + dx;
        let y: number = move.y + dy;
        const toFlip: [number, number][] = [];

        while (x >= 0 && y >= 0 && x < 8 && y < 8) {
            const current: Field = newBoard[x][y];
            if (current === opponent) {
                toFlip.push([x, y]);
            } else if (current === player) {
                toFlip.forEach(([fx, fy]) => (newBoard[fx][fy] = player));
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
    const isCorner = (move: Move): boolean =>
        CORNERS.some((c: Move): boolean => c.x === move.x && c.y === move.y);

    return moves.sort((a: Move, b: Move): number => {
        if (isCorner(a)) return -1;
        if (isCorner(b)) return 1;

        const evalFn =
            difficulty === Difficulty.HARD
                ? evaluateBoardAdvanced
                : evaluateBoard;
        const scoreA = evalFn(applyMoveForPlayer(board, player, a), player);
        const scoreB = evalFn(applyMoveForPlayer(board, player, b), player);

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

    const validMoves = getValidMovesForPlayer(board, player);
    if (depth === 0 || validMoves.length === 0) {
        return quiescenceSearch(board, player, alpha, beta);
    }

    const opponent = getOpponent(player);
    let bestEval = player === BLACK ? -Infinity : Infinity;

    for (const move of validMoves) {
        const newBoard = applyMoveForPlayer(board, player, move);
        const evalScore = minmax(newBoard, depth - 1, opponent, alpha, beta);

        if (player === BLACK) {
            bestEval = Math.max(bestEval, evalScore);
            alpha = Math.max(alpha, bestEval);
        } else {
            bestEval = Math.min(bestEval, evalScore);
            beta = Math.min(beta, bestEval);
        }

        if (beta <= alpha) break;
    }

    transpositionTable.set(key, bestEval);
    return bestEval;
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

    const noisyMoves: Move[] = getValidMovesForPlayer(board, player).filter(
        (move: Move): boolean => !isQuietPosition(board, move, player),
    );

    for (const move of noisyMoves) {
        const newBoard: Board = applyMoveForPlayer(board, player, move);
        const score: number = -quiescenceSearch(
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
    const opponent: Player = getOpponent(player);
    const validMoves: Move[] = getValidMovesForPlayer(board, player);
    if (depth === 0 || validMoves.length === 0) {
        return quiescenceSearch(board, player, alpha, beta);
    }

    const promises: Promise<number>[] = validMoves.map(
        (move: Move): Promise<number> => {
            const worker = new Worker(
                new URL('./minmax.worker.ts', import.meta.url),
                { type: 'module' },
            );
            const newBoard: Board = applyMoveForPlayer(board, player, move);

            return new Promise<number>((resolve, reject) => {
                worker.onmessage = ({
                    data,
                }: MessageEvent<MinMaxWorkerResult>) => {
                    worker.terminate();

                    if (!data || typeof data !== 'object') {
                        return reject(
                            new Error('Worker returned malformed message'),
                        );
                    }

                    if ('error' in data) {
                        return reject(new Error(data.error ?? 'Unknown error'));
                    }

                    if (typeof data.score !== 'number') {
                        return reject(
                            new Error(
                                'Missing or invalid score in worker result',
                            ),
                        );
                    }

                    resolve(data.score);
                };

                worker.onerror = (err) => {
                    worker.terminate();
                    reject(new Error(`Worker crashed: ${err.message}`));
                };

                worker.postMessage({
                    board: newBoard,
                    depth: depth - 1,
                    player: opponent,
                    alpha,
                    beta,
                });
            });
        },
    );

    const scores: number[] = await Promise.all(promises);
    return player === BLACK ? Math.max(...scores) : Math.min(...scores);
}

export async function findBestMoveForPlayer(
    board: Board,
    player: Player,
    depth: number,
    difficulty: Difficulty,
): Promise<Move | null> {
    const opponent: Player = getOpponent(player);
    const orderedMoves: Move[] = orderMoves(
        getValidMovesForPlayer(board, player),
        board,
        player,
        difficulty,
    );
    let bestMove: Move | null = null;
    let bestScore: number = -Infinity;

    for (const move of orderedMoves) {
        const newBoard: Board = applyMoveForPlayer(board, player, move);
        const score: number = -(await minmaxParallel(
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
    const stage =
        numberOfMoves < EARLY ? 'early' : numberOfMoves < MID ? 'mid' : 'late';

    const mapping = {
        [Difficulty.EASY]: { early: 2, mid: 2, late: 4 },
        [Difficulty.MEDIUM]: { early: 3, mid: 2, late: 6 },
        [Difficulty.HARD]: { early: 5, mid: 6, late: 8 },
    };

    const dynamicBoost = Math.max(
        0,
        Math.min(2, Math.floor((64 - numberOfMoves) / 10)),
    );

    return mapping[difficulty][stage] + dynamicBoost;
}

export function getStartGame(): Board {
    const board: Board = Array.from({ length: 8 }, () => Array(8).fill(EMPTY));
    board[3][3] = WHITE;
    board[3][4] = BLACK;
    board[4][3] = BLACK;
    board[4][4] = WHITE;
    return board;
}

export function checkIsGameOver(board: Board): boolean {
    const totalPieces =
        countItemsOnBoard(board, WHITE) + countItemsOnBoard(board, BLACK);
    if (totalPieces === 64) return true;

    const whiteMoves: Move[] = getValidMovesForPlayer(board, WHITE);
    const blackMoves: Move[] = getValidMovesForPlayer(board, BLACK);
    return whiteMoves.length === 0 && blackMoves.length === 0;
}

export function countItemsOnBoard(board: Board, player: Player): number {
    return board.reduce(
        (total: number, row: Field[]): number =>
            total +
            row.filter((field: Field): boolean => field === player).length,
        0,
    );
}

export function evaluateBoard(board: Board, player: Player): number {
    let score: number = 0;
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            const type = board[x][y];
            if (type === player) score += BOARD_WEIGHTS[x][y];
            else if (type !== EMPTY) score -= BOARD_WEIGHTS[x][y];
        }
    }
    score += getValidMovesForPlayer(board, player).length * 10;
    return score;
}

export function evaluateBoardAdvanced(board: Board, player: Player): number {
    const opponent: Player = getOpponent(player);
    let score = 0;
    let playerDiscs = 0;
    let opponentDiscs = 0;
    let playerCorners = 0;
    let opponentCorners = 0;

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            const type = board[x][y];
            if (type === player) {
                score += BOARD_WEIGHTS[x][y];
                playerDiscs++;
            } else if (type === opponent) {
                score -= BOARD_WEIGHTS[x][y];
                opponentDiscs++;
            }
        }
    }

    for (const corner of CORNERS) {
        const field: Field = board[corner.x][corner.y];
        if (field === player) {
            playerCorners++;
        } else if (field === opponent) {
            opponentCorners++;
        }
    }

    const parity: number =
        (100 * (playerDiscs - opponentDiscs)) /
        (playerDiscs + opponentDiscs + 1);
    const cornerScore: number = 100 * (playerCorners - opponentCorners);
    const mobility: number =
        getValidMovesForPlayer(board, player).length -
        getValidMovesForPlayer(board, opponent).length;

    return score + parity + cornerScore * 5 + mobility * 10;
}
