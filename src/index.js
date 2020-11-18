import {Application, Sprite, Rectangle, Graphics} from 'pixi.js-legacy';
import CONFIG from './core/config';
import bg from './images/bg.jpg';
import './css/index.scss';
import {createBoard, createMissPoint, drawShips, initGrid, loadAssets, pointToBoard, randomPlayer} from "./core/utils";
import {randomLocationShips, robotMove} from "./core/common";

const gameNode = document.getElementById('game');
const game = new Application({
    antialias: true,
    resolution: devicePixelRatio,
    autoDensity: true,
    resizeTo: gameNode,
});

gameNode.appendChild(game.view);

let mover, waiter, currentPlayer, opponentPlayer, ships, leftBoard, rightBoard;

const players = [
    {id: 1, board: [], squadron: [], hits: 0, isRobot: 0},
    {id: 2, board: [], squadron: [], hits: 0, isRobot: 1},
];

const loader = loadAssets({'bg': bg});

loader.then(({loader, resources}) => {
    game.stage.addChild(new Sprite(resources.bg.texture));
    leftBoard = createBoard(game.screen.width, game.screen.height);
    rightBoard = createBoard(game.screen.width, game.screen.height, game.screen.width / 2);
    rightBoard.interactive = true;
    rightBoard.buttonMode = true;
    rightBoard.hitArea = new Rectangle(0, 0, game.screen.width / 2 - CONFIG.PADDING.X * 2, game.screen.height - CONFIG.PADDING.Y * 2);
    rightBoard.on('click', fireHandler);

    game.stage.addChild(leftBoard, rightBoard);
    initGrid();

    currentPlayer = players[0];
    opponentPlayer = players[1];

    players.forEach(player => {
        randomLocationShips(player);

        if (player.id === currentPlayer.id) {
            ships = drawShips(player.board);
            leftBoard.addChild(ships);
        } else {
            const xships = drawShips(player.board, false);
            rightBoard.addChild(xships);
        }
    });

    mover = randomPlayer(players);
    waiter = players.find(player => player.id !== mover.id);

    if (mover.isRobot) {
        const {row, col} = robotMove();

        if (waiter.board[row][col]) {
            waiter.board[row][col] = 0;
            const deck = ships.getChildByName(`row${row}:col${col}`);
            ships.removeChild(deck);
        } else {
            //[mover, waiter] = [waiter, mover];
        }
    }
});



function fireHandler(event) {
    const {x, y} = event.data.getLocalPosition(rightBoard);
    const {row, col} = pointToBoard(x, y);

    if (opponentPlayer.board[row][col] > 0) {
        const deck = rightBoard.children[44].getChildByName(`row${row}:col${col}`);
        deck.removeChildren();
        deck.visible = true;
        //opponentPlayer.board[row][col] = 0;
        opponentPlayer.hits--;

        /*console.log('ship hits:', opponentPlayer.board[row][col]);
        if (opponentPlayer.board[row][col] === 0) {
            alert('Ship is sunk!')
        }*/

        if (opponentPlayer.hits === 0) {
            alert('You win!')
        }
    } else {
        const missPoint = createMissPoint(row, col);
        rightBoard.addChild(missPoint);

        //[mover, waiter] = [waiter, mover];
    }
}