import CONFIG from './config';
import {random} from './utils';

export function randomLocationShips(player) {
    player.board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    for (let i = 1, length = CONFIG.SHIPS.length; i < length; i++) {
        const [decks, name] = CONFIG.SHIPS[i];

        for (let j = 0; j < i; j++) {
            const coords = getCoordinatesDecks(player, decks);
            coords.decks = decks;
            coords.shipname	= name + String(j + 1);

            createShip(player, coords);
        }
    }

    player.hits = player.squadron.reduce((acc, decks) => acc += +decks, 0);
}

function getCoordinatesDecks(player, decks) {
    const kx = random(1);
    const ky = (kx === 0) ? 1 : 0;
    let x, y;

    if (kx === 0) {
        x = random(9);
        y = random(10 - decks);
    } else {
        x = random(10 - decks);
        y = random(9);
    }

    const result = checkLocationShip(x, y, kx, ky, decks, player);
    if (!result) {
        return getCoordinatesDecks(player, decks);
    }

    return {x, y, kx, ky};
}


function checkLocationShip(x, y, kx, ky, decks, player) {
    let toX, toY;

    const fromX = (x === 0) ? x : x - 1;
    if (x + kx * decks === 10 && kx === 1) {
        toX = x + kx * decks;
    } else if (x + kx * decks < 10 && kx === 1) {
        toX = x + kx * decks + 1;
    } else if (x === 9 && kx === 0) {
        toX = x + 1;
    } else if (x < 9 && kx === 0) {
        toX = x + 2;
    }

    const fromY = (y === 0) ? y : y - 1;
    if (y + ky * decks === 10 && ky === 1) {
        toY = y + ky * decks;
    } else if (y + ky * decks < 10 && ky === 1) {
        toY = y + ky * decks + 1;
    } else if (y === 9 && ky === 0) {
        toY = y + 1;
    } else if (y < 9 && ky === 0) {
        toY = y + 2;
    }

    for (let i = fromX; i < toX; i++) {
        for (let j = fromY; j < toY; j++) {
            if (player.board[i][j] !== 0) {
                return false;
            }
        }
    }
    return true;
}


function createShip(player, coords) {
    let x	= coords.x,
        y	= coords.y,
        kx	= coords.kx,
        ky	= coords.ky;

    for (let k = 0; k < coords.decks; k++) {
        player.board[x + k * kx][y + k * ky] = {...coords};
    }

    player.squadron.push(coords.decks);
}

export function robotMove(moves) {
    const row = random(9);
    const col = random(9);

    const move = moves.find(move => move.row === row && move.col === col);
    if (move) {
        return robotMove(moves);
    }

    return {row, col};
}

