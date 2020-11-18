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
    const ships = new Container();
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col]) {
                const partShip = createPartShip(board[row][col], cell.width);
                partShip.position.set(cell.width * col, cell.width * row);
                partShip.name = `row${row}:col${col}`;
                partShip.visible = visible;
                ships.addChild(partShip);
            }
        }
    }

    return ships;
}

function createPartShip(part, size) {
    const rect = new Graphics();
    rect.beginFill(0xffffff, 0.8);
    rect.drawRect(0, 0, size, size);
    rect.endFill();

    const deck = new Graphics();
    deck.beginFill(0x000000, 0.7);
    deck.drawCircle(size / 2, size / 2, size / 5);
    deck.endFill();

    rect.addChild(deck);

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