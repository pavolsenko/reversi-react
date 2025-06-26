import { MinMaxWorkerData } from '@/interfaces/game';
import { minmax } from '@/helpers/game';

onmessage = (event: MessageEvent<MinMaxWorkerData>) => {
    const { board, depth, player, alpha, beta } = event.data;

    try {
        const score = minmax(board, depth, player, alpha, beta);
        postMessage(score);
    } catch (err) {
        postMessage({ error: (err as Error).message });
    }
};
