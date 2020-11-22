import {Container, Graphics, Loader, Text} from "pixi.js-legacy";
import CONFIG from './config';
import styles from './styles';

const grid = [];
const cell = {};

export function createBoard(width, height, offsetX = 0) {
    const board = new Container();
    board.position.set(CONFIG.PADDING.X + offsetX, CONFIG.PADDING.Y);

    cell.width = ((width / 2) - CONFIG.PADDING.X * 2) / CONFIG.SIZE;
    cell.height = (height - CONFIG.PADDING.Y * 2) / CONFIG.SIZE;

    for (let i = 0; i <= CONFIG.SIZE; i++) {
        // Линия
        const line = new Graphics();
        line.lineStyle(styles.line.width, styles.line.color, styles.line.alpha);
        line.moveTo(0, i * cell.height);
        line.lineTo(width / 2 - CONFIG.PADDING.X * 2, i * cell.height);

        // Цифра
        const labelText = new Text(CONFIG.ROWS[i], styles.text);
        labelText.position.set(-CONFIG.PADDING.Y / 2, i * cell.height + cell.height / 2);
        labelText.anchor.set(0.5);

        board.addChild(line, labelText);
    }

    for (let i = 0; i <= CONFIG.SIZE; i++) {
        // Линия
        const line = new Graphics();
        line.lineStyle(styles.line.width, styles.line.color, styles.line.alpha);
        line.moveTo(i * cell.width, 0);
        line.lineTo(i * cell.width, height - CONFIG.PADDING.Y * 2);

        // Буква
        const labelText = new Text(CONFIG.COLS[i], styles.text);
        labelText.position.set(i * cell.width + cell.width / 2, -CONFIG.PADDING.X / 2);
        labelText.anchor.set(0.5);

        board.addChild(line, labelText);
    }

    return board;
}

export function drawShips(board, visible = true) {
    const temp = [];
    const ships = new Container();
    ships.sortableChildren = true;
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col]) {
                const place = board[row][col];

                const deck = createDeck();
                deck.position.set(cell.width * col, cell.width * row);
                deck.name = `row${row}:col${col}`;
                deck.shipName = place.shipname;
                ships.addChild(deck);

                if (!temp.includes(place.shipname)) {
                    const ship = new Graphics();
                    ship.name = place.shipname;
                    ship.decks = [];
                    ship.decks.push(1)
                    ship.zIndex = 1;
                    ship.visible = visible;
                    ship.lineStyle(3, 0x000000);
                    //ship.beginFill(0x000000, 0.3);
                    ship.drawRect(
                        cell.width * place.y,
                        cell.height * place.x,
                        cell.width + cell.width * place.ky * (place.decks - 1),
                        cell.height + cell.height * place.kx * (place.decks - 1)
                    );
                    //ship.endFill();

                    temp.push(place.shipname);
                    ships.addChild(ship);
                } else {
                    const ship = ships.getChildByName(place.shipname);
                    ship.decks.push(1);
                }
            }
        }
    }

    return ships;
}

function createDeck() {
    const rect = new Graphics();
    rect.drawRect(0, 0, cell.width, cell.height);

    return rect;
}

export function random(max) {
    return Math.floor(Math.random() * (max + 1));
}

export function loadAssets(assets = {}) {
    const loader = new Loader();

    Object.keys(assets).forEach(key => {
        loader.add(key, assets[key]);
    });

    return new Promise((resolve) => {
        loader.load((loader, resources) => {
            resolve({
                loader,
                resources
            });
        });
    });
}

export function randomPlayer(players) {
    return players[random(1)];
}

export function pointToBoard(x, y) {
    const grid = getGrid();
    for (let row = 0; row < CONFIG.SIZE; row++) {
        for (let col = 0; col < CONFIG.SIZE; col++) {
            if (x > grid[row][col].x && x < grid[row][col].x + cell.width && y > grid[row][col].y && y < grid[row][col].y + cell.height) {
                return {row, col};
            }
        }
    }
    return {};
}

export function initGrid() {
    for (let row = 0; row < CONFIG.SIZE; row++) {
        grid[row] = [];
        for (let col = 0; col < CONFIG.SIZE; col++) {
            grid[row][col] = {
                x: col * cell.width,
                y: row * cell.height,
            };
        }
    }
}

function getGrid() {
    return grid;
}

export function createMissPoint(row, col) {
    const point = new Graphics();
    point.beginFill(0xffffff, 1);
    point.drawCircle(col * cell.width + cell.width / 2, row * cell.height + cell.height / 2, 5);
    point.endFill();

    return point;
}

export function createHitPoint() {
    const width = 5;
    const offset = 8;

    const times = new Graphics();
    times.lineStyle(width, 0xf13630, 0.8);
    times.moveTo(offset, offset);
    times.lineTo(cell.width - offset, cell.height - offset);
    times.moveTo(offset, cell.height - offset);
    times.lineTo(cell.width - offset, offset);

    return times;
}