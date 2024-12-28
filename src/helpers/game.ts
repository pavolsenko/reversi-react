import {
    BLACK,
    Board,
    Difficulty,
    DIRECTIONS,
    EMPTY,
    Field,
    Move,
    Player,
    WHITE,
} from '../interfaces/game';

export function getStartGame(): Board {
    const board: Board = Array.from({ length: 8 }, (): Field[] =>
        Array.from({ length: 8 }, (): Field => ({ type: EMPTY })),
    );

    board[3][3].type = WHITE;
    board[3][4].type = BLACK;
    board[4][3].type = BLACK;
    board[4][4].type = WHITE;

    return board;
}

export function checkIsGameOver(board: Board): boolean {
    const white: number = countItemsOnBoard(board, WHITE);
    const black: number = countItemsOnBoard(board, BLACK);

    if (white + black === 64) {
        return true;
    }

    const whiteValidMoves: Move[] = getValidMovesForPlayer(board, WHITE);
    const blackValidMoves: Move[] = getValidMovesForPlayer(board, BLACK);

    return whiteValidMoves.length === 0 && blackValidMoves.length === 0;
}

export function countItemsOnBoard(board: Board, player: Player): number {
    let count: number = 0;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[x][y].type === player) {
                count++;
            }
        }
    }

    return count;
}

export function isValidMove(board: Board, move: Move, player: Player): boolean {
    if (board[move.x][move.y].type !== EMPTY) {
        return false;
    }

    const opponent: Player = player === BLACK ? WHITE : BLACK;
    for (const [dx, dy] of DIRECTIONS) {
        let newX = move.x + dx;
        let newY = move.y + dy;
        let hasOpponentBetween = false;

        while (
            newX >= 0 &&
            newX < board.length &&
            newY >= 0 &&
            newY < board[0].length
        ) {
            if (board[newX][newY].type === opponent) {
                hasOpponentBetween = true;
            } else if (
                board[newX][newY].type === player &&
                hasOpponentBetween
            ) {
                return true;
            } else {
                break;
            }

            newX += dx;
            newY += dy;
        }
    }

    return false;
}

export function getValidMovesForPlayer(board: Board, player: Player): Move[] {
    const validMoves: Move[] = [];
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (isValidMove(board, { x, y }, player)) {
                validMoves.push({
                    x,
                    y,
                });
            }
        }
    }
    return validMoves;
}

export function applyMoveForPlayer(
    board: Board,
    player: Player,
    move: Move,
): Board {
    const newBoard: Board = board.map((row) =>
        row.map((field) => ({ ...field })),
    );

    const opponent: Player = player === BLACK ? WHITE : BLACK;
    newBoard[move.x][move.y].type = player;

    for (const [dx, dy] of DIRECTIONS) {
        let newX = move.x + dx;
        let newY = move.y + dy;
        const flipPositions: [number, number][] = [];

        while (
            newX >= 0 &&
            newX < newBoard.length &&
            newY >= 0 &&
            newY < newBoard[0].length
        ) {
            if (newBoard[newX][newY].type === opponent) {
                flipPositions.push([newX, newY]);
            } else if (newBoard[newX][newY].type === player) {
                for (const [fx, fy] of flipPositions) {
                    newBoard[fx][fy].type = player;
                }
                break;
            } else {
                break;
            }

            newX += dx;
            newY += dy;
        }
    }
    return newBoard;
}

export function orderMoves(moves: Move[], board: Board, player: Player): Move[] {
    const corners: Move[] = [
        { x: 0, y: 0 },
        { x: 0, y: 7 },
        { x: 7, y: 0 },
        { x: 7, y: 7 },
    ];

    const isCorner = (move: Move): boolean =>
        corners.some((corner) => corner.x === move.x && corner.y === move.y);

    return moves.sort((a: Move, b: Move): number => {
        if (isCorner(b)) {
            return 1;
        }

        if (isCorner(a)) {
            return -1;
        }

        const evalA: number = evaluateBoard(
            applyMoveForPlayer(board, player, a),
            player,
        );

        const evalB: number = evaluateBoard(
            applyMoveForPlayer(board, player, b),
            player,
        );

        return evalB - evalA;
    });
}

function evaluateBoard(board: Board, player: Player): number {
    const weights = [
        [100, -20, 10, 5, 5, 10, -20, 100],
        [-20, -50, -2, -2, -2, -2, -50, -20],
        [10, -2, 5, 1, 1, 5, -2, 10],
        [5, -2, 1, 0, 0, 1, -2, 5],
        [5, -2, 1, 0, 0, 1, -2, 5],
        [10, -2, 5, 1, 1, 5, -2, 10],
        [-20, -50, -2, -2, -2, -2, -50, -20],
        [100, -20, 10, 5, 5, 10, -20, 100],
    ];

    let score = 0;
    let mobility = 0;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[y][x].type === player) {
                score += weights[y][x];
            } else if (board[y][x].type !== EMPTY) {
                score -= weights[y][x];
            }
        }
    }

    mobility += getValidMovesForPlayer(board, player).length;
    score += mobility * 10;

    return score;
}

const transpositionTable = new Map<string, number>();

function generateHash(board: Board): string {
    return board.flat().map(field => field.type).join('');
}

export function minmax(
    board: Board,
    depth: number,
    player: Player,
    alpha: number,
    beta: number,
): number {
    const opponent = player === BLACK ? WHITE : BLACK;
    const legalMoves: Move[] = getValidMovesForPlayer(board, player);

    if (depth === 0 || legalMoves.length === 0) {
        return countItemsOnBoard(board, player);
    }

    const hash = generateHash(board);
    if (transpositionTable.has(hash)) {
        return transpositionTable.get(hash)!;
    }

    if (player === BLACK) {
        let maxEval = -Infinity;
        for (const move of legalMoves) {
            const newBoard = applyMoveForPlayer(board, player, move);
            const evaluation = minmax(
                newBoard,
                depth - 1,
                opponent,
                alpha,
                beta,
            );
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
        }
        transpositionTable.set(hash, maxEval);
        return maxEval;
    } else {
        let minEval: number = Infinity;
        for (const move of legalMoves) {
            const newBoard: Board = applyMoveForPlayer(board, player, move);
            const evaluation: number = minmax(
                newBoard,
                depth - 1,
                opponent,
                alpha,
                beta,
            );
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) {
                break;
            }
        }
        transpositionTable.set(hash, minEval);
        return minEval;
    }
}

export async function minmaxParallel(
    board: Board,
    depth: number,
    player: Player,
    alpha: number,
    beta: number,
): Promise<number> {
    const opponent = player === BLACK ? WHITE : BLACK;
    const legalMoves: Move[] = getValidMovesForPlayer(board, player);

    if (depth === 0 || legalMoves.length === 0) {
        return evaluateBoard(board, player);
    }

    const workerPromises = legalMoves.map((move) => {
        const worker = new Worker(new URL('./minmax.worker.ts', import.meta.url), {type: 'module'});
        const newBoard = applyMoveForPlayer(board, player, move);

        return new Promise<number>((resolve, reject) => {
            worker.onmessage = (event) => {
                resolve(event.data);
                worker.terminate();
            };
            worker.onerror = (error) => {
                reject(error);
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

    if (player === BLACK) {
        const scores = await Promise.all(workerPromises);
        return Math.max(...scores);
    } else {
        const scores = await Promise.all(workerPromises);
        return Math.min(...scores);
    }
}

export async function findBestMoveForPlayer(
    board: Board,
    player: Player,
    depth: number,
): Promise<Move | null> {
    const opponent = player === BLACK ? WHITE : BLACK;
    let bestMove: Move | null = null;
    let bestScore = -Infinity;

    const legalMoves: Move[] = orderMoves(
        getValidMovesForPlayer(board, player),
        board,
        player,
    );

    for (const move of legalMoves) {
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
    if (difficulty === Difficulty.EASY) {
        if (numberOfMoves < 32) {
            return 1;
        } else {
            return 3;
        }
    }

    if (difficulty === Difficulty.MEDIUM) {
        if (numberOfMoves < 16) {
            return 3;
        } else {
            return 5;
        }
    }

    if (difficulty === Difficulty.HARD) {
        if (numberOfMoves < 8) {
            return 3;
        }

        if (numberOfMoves < 16) {
            return 5;
        }

        return 7;
    }

    return 1;
}
