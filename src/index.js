import {Application, Sprite, Rectangle, Loader, Graphics} from 'pixi.js-legacy';
import CONFIG from './core/config';
import bg from './images/bg.jpg';
import './css/index.scss';
import {createBoard, drawShips, loadAssets} from "./core/utils";
import {randomLocationShips} from "./core/common";

const gameNode = document.getElementById('game');
const game = new Application({
    antialias: true,
    resolution: devicePixelRatio,
    autoDensity: true,
    resizeTo: gameNode,
});

gameNode.appendChild(game.view);

const players = [
    {id: 1, board: [...CONFIG.BOARD], squadron: [], isRobot: 0},
    {id: 2, board: [...CONFIG.BOARD], squadron: [], isRobot: 1},
];

const loader = loadAssets({
    'bg': bg,
});

loader.then(({loader, resources}) => {
    game.stage.addChild(new Sprite(resources.bg.texture));

    //const players = xPlayers.map(randomLocationShips);
    //console.log(players);

    players.forEach(player => {
        console.log(player);
        randomLocationShips(player);

        if (!player.isRobot) {
            const leftBoard = createBoard(game.screen.width, game.screen.height);
            const rightBoard = createBoard(game.screen.width, game.screen.height, game.screen.width / 2);

            const ships = drawShips(player.board);
            leftBoard.addChild(ships);

            rightBoard.interactive = true;
            rightBoard.buttonMode = true;
            rightBoard.hitArea = new Rectangle(0, 0, game.screen.width / 2 - CONFIG.PADDING.X * 2, game.screen.height - CONFIG.PADDING.Y * 2);
            rightBoard.on('pointerdown', fireHandler);

            game.stage.addChild(leftBoard, rightBoard);
        }
    });
});


function fireHandler(event) {
    console.log('Fire!');
}
