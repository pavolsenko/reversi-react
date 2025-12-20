import {
    BOARD_WEIGHTS,
    C_SQUARES,
    CORNERS,
    DIRECTIONS,
    X_SQUARES,
} from '@/constants/game';
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
                toFlip.forEach(
                    ([fx, fy]: [number, number]): Player =>
                        (newBoard[fx][fy] = player),
                );
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
function isCorner(move: Move): boolean {
    return CORNERS.some((corner) => corner.x === move.x && corner.y === move.y);
}

export function orderMoves(
    moves: Move[],
    board: Board,
    player: Player,
    difficulty: Difficulty,
): Move[] {
    if (moves.length <= 1) return moves;

    const evalFn =
        difficulty === Difficulty.HARD ? evaluateBoardAdvanced : evaluateBoard;

    const opponent = getOpponent(player);

    return moves
        .map((move) => {
            const isCornerMove = isCorner(move) ? 1 : 0;

            const newBoard = applyMoveForPlayer(board, player, move);
            const myMobility = getValidMovesForPlayer(newBoard, player).length;
            const oppMobility = getValidMovesForPlayer(
                newBoard,
                opponent,
            ).length;
            const mobilityDiff = myMobility - oppMobility;

            const evalScore = evalFn(newBoard, player);

            const score =
                isCornerMove * 100000 + evalScore * 10 + mobilityDiff * 5;

            return { move, score };
        })
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.move);
}

enum TTFlag {
    EXACT,
    LOWERBOUND,
    UPPERBOUND,
}

type TTEntry = {
    value: number;
    depth: number;
    flag: TTFlag;
};

const transpositionTable = new Map<string, TTEntry>();

function ttKey(board: Board, player: Player): string {
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

function ttLookup(
    board: Board,
    player: Player,
    depth: number,
    alpha: number,
    beta: number,
): number | null {
    const key = ttKey(board, player);
    const entry = transpositionTable.get(key);
    if (!entry || entry.depth < depth) return null;

    const { value, flag } = entry;

    if (flag === TTFlag.EXACT) {
        return value;
    }
    if (flag === TTFlag.LOWERBOUND && value >= beta) {
        return value;
    }
    if (flag === TTFlag.UPPERBOUND && value <= alpha) {
        return value;
    }

    return null;
}

function ttStore(
    board: Board,
    player: Player,
    depth: number,
    value: number,
    alphaOrig: number,
    beta: number,
): void {
    const key = ttKey(board, player);

    let flag: TTFlag;
    if (value <= alphaOrig) flag = TTFlag.UPPERBOUND;
    else if (value >= beta) flag = TTFlag.LOWERBOUND;
    else flag = TTFlag.EXACT;

    const existing = transpositionTable.get(key);
    if (!existing || existing.depth <= depth) {
        transpositionTable.set(key, { value, depth, flag });
    }
}

export function negamax(
    board: Board,
    depth: number,
    alpha: number,
    beta: number,
    player: Player,
): number {
    const alphaOrig = alpha;

    const cached = ttLookup(board, player, depth, alpha, beta);
    if (cached !== null) {
        return cached;
    }

    if (depth === 0 || isGameOver(board)) {
        const standPat = quiescenceSearch(board, player, alpha, beta);
        ttStore(board, player, depth, standPat, alphaOrig, beta);
        return standPat;
    }

    const moves = getValidMovesForPlayer(board, player);
    const opponent = getOpponent(player);

    if (moves.length === 0) {
        const val = -negamax(board, depth - 1, -beta, -alpha, opponent);
        ttStore(board, player, depth, val, alphaOrig, beta);
        return val;
    }

    let value = -Infinity;

    for (const move of moves) {
        const newBoard = applyMoveForPlayer(board, player, move);
        const score = -negamax(newBoard, depth - 1, -beta, -alpha, opponent);

        if (score > value) {
            value = score;
        }
        if (score > alpha) {
            alpha = score;
        }
        if (alpha >= beta) {
            break;
        }
    }

    ttStore(board, player, depth, value, alphaOrig, beta);
    return value;
}

function isNoisyMove(board: Board, move: Move, player: Player): boolean {
    const opponent = getOpponent(player);

    // Flips many discs → noisy.
    let flips = 0;
    for (const [dx, dy] of DIRECTIONS) {
        let x = move.x + dx;
        let y = move.y + dy;
        let localFlips = 0;

        while (x >= 0 && y >= 0 && x < 8 && y < 8) {
            const current = board[x][y];

            if (current === opponent) {
                localFlips++;
            } else if (current === player) {
                flips += localFlips;
                break;
            } else {
                break;
            }

            x += dx;
            y += dy;
        }
    }

    const isEdge = move.x === 0 || move.x === 7 || move.y === 0 || move.y === 7;

    return isEdge || flips >= 3;
}
function quiescenceSearch(
    board: Board,
    player: Player,
    alpha: number,
    beta: number,
): number {
    // Use your advanced evaluator: mobility, corners, parity, etc. [web:18][web:21][web:71]
    const standPat = evaluateBoardAdvanced(board, player);

    if (standPat >= beta) {
        return beta;
    }
    if (standPat > alpha) {
        alpha = standPat;
    }

    const moves = getValidMovesForPlayer(board, player);
    const opponent = getOpponent(player);

    // Only explore noisy moves to avoid search explosion. [web:65][web:66][web:68]
    const noisyMoves = moves.filter((move) => isNoisyMove(board, move, player));

    for (const move of noisyMoves) {
        const newBoard = applyMoveForPlayer(board, player, move);
        const score = -quiescenceSearch(newBoard, opponent, -beta, -alpha);

        if (score >= beta) {
            return beta;
        }
        if (score > alpha) {
            alpha = score;
        }
    }

    return alpha;
}
export async function negamaxParallel(
    board: Board,
    depth: number,
    alpha: number,
    beta: number,
    player: Player,
): Promise<number> {
    if (depth === 0 || isGameOver(board)) {
        return quiescenceSearch(board, player, alpha, beta);
    }

    const moves = getValidMovesForPlayer(board, player);
    const opponent = getOpponent(player);

    if (moves.length === 0) {
        // Pass move
        return -negamax(board, depth - 1, -beta, -alpha, opponent);
    }

    const promises = moves.map((move) => {
        const worker = new Worker(
            new URL('./minmax.worker.ts', import.meta.url),
            {
                type: 'module',
            },
        );
        const newBoard = applyMoveForPlayer(board, player, move);

        return new Promise<number>((resolve, reject) => {
            worker.onmessage = ({ data }: MessageEvent<MinMaxWorkerResult>) => {
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
                        new Error('Missing or invalid score in worker result'),
                    );
                }

                // Worker runs negamax from opponent's perspective; flip sign. [web:49][web:52]
                resolve(-data.score);
            };

            worker.onerror = (err) => {
                worker.terminate();
                reject(new Error(`Worker crashed: ${err.message}`));
            };

            worker.postMessage({
                board: newBoard,
                depth: depth - 1,
                player: opponent,
                alpha: -beta,
                beta: -alpha,
            });
        });
    });

    const scores = await Promise.all(promises);
    return Math.max(...scores);
}
export async function findBestMoveForPlayer(
    board: Board,
    player: Player,
    depth: number,
    difficulty: Difficulty,
): Promise<Move | null> {
    const opponent = getOpponent(player);
    const orderedMoves = orderMoves(
        getValidMovesForPlayer(board, player),
        board,
        player,
        difficulty,
    );
    if (orderedMoves.length === 0) return null;

    let bestMove: Move | null = null;
    let bestScore = -Infinity;

    for (const move of orderedMoves) {
        const newBoard = applyMoveForPlayer(board, player, move);
        const score = await negamaxParallel(
            newBoard,
            depth - 1,
            -Infinity,
            Infinity,
            opponent,
        );

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

export function isGameOver(board: Board): boolean {
    const totalPieces: number =
        countItemsOnBoard(board, WHITE) + countItemsOnBoard(board, BLACK);
    if (totalPieces === 64) {
        return true;
    }

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
    const opponent = getOpponent(player);
    let positional = 0;
    let playerDiscs = 0;
    let opponentDiscs = 0;
    let playerCorners = 0;
    let opponentCorners = 0;

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            const type = board[x][y];

            if (type === player) {
                positional += BOARD_WEIGHTS[x][y];
                playerDiscs++;
            } else if (type === opponent) {
                positional -= BOARD_WEIGHTS[x][y];
                opponentDiscs++;
            }
        }
    }

    const totalDiscs = playerDiscs + opponentDiscs;
    const empties = 64 - totalDiscs;

    for (const corner of CORNERS) {
        const field = board[corner.x][corner.y];
        if (field === player) playerCorners++;
        else if (field === opponent) opponentCorners++;
    }
    const cornerScore = 100 * (playerCorners - opponentCorners);

    const parity =
        totalDiscs === 0
            ? 0
            : (100 * (playerDiscs - opponentDiscs)) / totalDiscs;

    const myMoves = getValidMovesForPlayer(board, player).length;
    const oppMoves = getValidMovesForPlayer(board, opponent).length;
    const totalMoves = myMoves + oppMoves;
    const mobility =
        totalMoves === 0 ? 0 : (100 * (myMoves - oppMoves)) / totalMoves;

    let xcScore = 0;
    const earlyMidFactor = empties > 20 ? 1 : 0.4; // reduce penalties near endgame

    for (const sq of X_SQUARES) {
        const field = board[sq.x][sq.y];
        if (field === player) xcScore -= 150 * earlyMidFactor;
        else if (field === opponent) xcScore += 150 * earlyMidFactor;
    }

    for (const sq of C_SQUARES) {
        const field = board[sq.x][sq.y];
        if (field === player) xcScore -= 60 * earlyMidFactor;
        else if (field === opponent) xcScore += 60 * earlyMidFactor;
    }

    let score = positional + cornerScore * 5 + mobility * 2 + xcScore;

    if (empties <= 16) {
        score += parity * 4;
    } else if (empties <= 32) {
        score += parity * 1.5 + mobility;
    } else {
        score += mobility * 2;
    }

    return score;
}
