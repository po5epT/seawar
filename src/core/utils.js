import {Container, Graphics, Loader, Text} from "pixi.js-legacy";
import CONFIG from './config';

const lineStyle = {
    width: 1,
    color: 0xffffff,
    alpha: 0.5,
}

const textStyle = {
    fontFamily: 'san-serif',
    fontSize: 16,
    fill: '#fff',
}

export function createBoard(width, height, offsetX = 0) {
    const board = new Container();
    board.position.set(CONFIG.PADDING.X + offsetX, CONFIG.PADDING.Y);

    const cellWidth = ((width / 2) - CONFIG.PADDING.X * 2) / CONFIG.GRID_SIZE;
    const cellHeight = (height - CONFIG.PADDING.Y * 2) / CONFIG.GRID_SIZE;

    for (let i = 0; i <= CONFIG.GRID_SIZE; i++) {
        // Линия
        const line = new Graphics();
        line.lineStyle(lineStyle.width, lineStyle.color, lineStyle.alpha);
        line.moveTo(0, i * cellHeight);
        line.lineTo(width / 2 - CONFIG.PADDING.X * 2, i * cellHeight);

        // Цифра
        const labelText = new Text(CONFIG.ROWS[i], textStyle);
        labelText.position.set(-CONFIG.PADDING.Y / 2, i * cellHeight + cellHeight / 2);
        labelText.anchor.set(0.5);

        board.addChild(line, labelText);
    }

    for (let i = 0; i <= CONFIG.GRID_SIZE; i++) {
        // Линия
        const line = new Graphics();
        line.lineStyle(lineStyle.width, lineStyle.color, lineStyle.alpha);
        line.moveTo(i * cellWidth, 0);
        line.lineTo(i * cellWidth, height - CONFIG.PADDING.Y * 2);

        // Буква
        const labelText = new Text(CONFIG.COLS[i], textStyle);
        labelText.position.set(i * cellWidth + cellWidth / 2, -CONFIG.PADDING.X / 2);
        labelText.anchor.set(0.5);

        board.addChild(line, labelText);
    }

    return board;
}

export function drawShips(board, size = 55) {
    const ships = new Container();
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col]) {
                const partShip = createPartShip(board[row][col], size);
                partShip.position.set(size * col, size * row);
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