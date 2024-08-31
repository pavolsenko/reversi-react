import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

export interface GameOverModalProps {
    isGameOver: boolean;
    onCloseClick: () => void;
    onResetClick: () => void;
    whiteCount: number;
    blackCount: number;
}

export function GameOverDialog(props: GameOverModalProps) {
    function getWinText(): string {
        if (props.whiteCount > props.blackCount) {
            return 'White won';
        }

        if (props.blackCount > props.whiteCount) {
            return 'Black won';
        }

        return 'Draw';
    }

    return (
        <Dialog open={props.isGameOver}>
            <DialogTitle>Game Over</DialogTitle>
            <DialogContent>
                <Typography variant={'h5'}>
                    {getWinText() + ' ' + props.whiteCount + ':' + props.blackCount}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onResetClick}>Reset Game</Button>
                <Button onClick={props.onCloseClick}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
