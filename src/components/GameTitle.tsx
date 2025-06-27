import { Box } from '@mui/material';

import { Player } from '@/interfaces/game';

interface GameTitleProps {
    whiteCount: number;
    blackCount: number;
    isGameOver: boolean;
    currentPlayer: Player;
}

export function GameTitle(props: GameTitleProps) {
    return (
        <>
            <Box>
                {'White ' +
                    props.whiteCount +
                    ':' +
                    props.blackCount +
                    ' Black'}
            </Box>
            <Box>
                {!props.isGameOver
                    ? 'Next turn: ' + props.currentPlayer.toUpperCase()
                    : null}
            </Box>
        </>
    );
}
