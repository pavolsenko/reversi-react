import { CircularProgress } from '@mui/material';

import { BLACK, Player } from '../../interfaces/game';

interface GameTitleProps {
    whiteCount: number;
    blackCount: number;
    isGameOver: boolean;
    currentPlayer: Player;
}

export function GameTitle(props: GameTitleProps) {
    return (
        <>
            {'White ' + props.whiteCount + ':' + props.blackCount + ' Black'}
            {!props.isGameOver ? '| Next turn: ' + props.currentPlayer.toUpperCase() : null}
            {props.currentPlayer === BLACK ? <CircularProgress size={12} sx={{ml: 1}}/> : null}
        </>
    );
}
