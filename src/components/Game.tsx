import { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';

import { getStartGame } from '../helpers/game.ts';
import { Grid } from './grid/Grid.tsx';
import { Game as GameType } from '../interfaces/game.ts';

export function Game() {
    const [game, setGame] = useState<GameType>(getStartGame());

    function resetGame() {
        setGame(getStartGame());
    }

    return (
        <Card elevation={2}>
            <CardContent>
                <Typography variant={'h5'} component={'div'}>
                    Reversi
                </Typography>
                <Box>
                    <Grid fields={game.fields}/>
                </Box>
            </CardContent>
            <CardActions>
                <Button onClick={resetGame}>Reset game</Button>
            </CardActions>
        </Card>
    );
}
