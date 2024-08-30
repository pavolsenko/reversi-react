import * as Immutable from 'immutable';

import { FieldType, Game } from '../interfaces/game.ts';

export function getStartGame(): Game {
    const game: Game = {
        fields: Immutable.Map(),
    };

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (y === 3 && x === 3) {
                game.fields = game.fields.setIn([x, y], {type: FieldType.WHITE});
                continue;
            }

            if (y === 3 && x === 4) {
                game.fields = game.fields.setIn([x, y], {type: FieldType.BLACK});
                continue;
            }

            if (y === 4 && x === 3) {
                game.fields = game.fields.setIn([x, y], {type: FieldType.BLACK});
                continue;
            }

            if (y === 4 && x === 4) {
                game.fields = game.fields.setIn([x, y], {type: FieldType.WHITE});
                continue;
            }

            game.fields = game.fields.setIn([x, y], {type: FieldType.EMPTY});
        }
    }

    return game;
}
