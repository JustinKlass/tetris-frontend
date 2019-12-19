import axios from 'axios.js';

const S_block = [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0]
]
const T_block = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
]
const O_block = [
    [1, 1],
    [1, 1]
]
const L_block = [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0]
]
const J_block = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 1]
]
const I_block = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0]
]
const Z_block = [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1]
]

let S_color = '#00F000';
let T_color = '#A000F0';
let O_color = '#F0F000';
let L_color = '#EEA000';
let J_color = '#0100F0';
let I_color = '#01F0F1';
let Z_color = '#EF0000';


let S_Y = -30;
let T_Y = -30;
let O_Y = 0;
let L_Y = -30;
let J_Y = -30;
let I_Y = -60;
let Z_Y = -30;

let S_X = 120;
let T_X = 120;
let O_X = 120;
let L_X = 90;
let J_X = 120;
let I_X = 90;
let Z_X = 120;

let S_count = 0;
let T_count = 0;
let O_count = 0;
let L_count = 0;
let J_count = 0;
let I_count = 0;
let Z_count = 0;

const blocks = [
    [S_block, S_color, '../img/S_block_image.png', 'S', S_X, S_Y, S_count], 
    [T_block, T_color, '../img/T_block_image.png', 'T', T_X, T_Y, T_count], 
    [O_block, O_color, '../img/O_block_image.png', 'O', O_X, O_Y, O_count],
    [L_block, L_color, '../img/L_block_image.png', 'L', L_X, L_Y, L_count],
    [J_block, J_color, '../img/J_block_image.png', 'J', J_X, S_Y, J_count],
    [I_block, I_color, '../img/I_block_image.png', 'I', I_X, I_Y, I_count],
    [Z_block, Z_color, '../img/Z_block_image.png', 'Z', Z_X, Z_Y, Z_count]
]

const marginPieceBeginning = 2
const collisionMargin = 1
const begginingPoint = 1
const startingPoints = 0
const squareSize = 30;
const leftEnd = 0;

let pause = false;
let loss = false;
let mute = false;
let newRandVal;
let score = 0;
let nextBlock;
let platform;
let nextImg;
let canvas;
let square;
let block;
let grav;
let high;

const getHighscore = async() => {
    let a = document.querySelector('#res');
    if (high === undefined) {
        let res = await axios.get('https://tetris-backend.herokuapp.com/scores')
        console.log(res)
        high = res.data[0].highScores
        // high = res.data[0].highScores
        a.innerHTML = high
    }
    else {
        a.innerHTML = high
    }
}

const post = async() => {
    await axios.post('https://tetris-backend.herokuapp.com/scores', { highScores: 600})
}

newGame = () => {
    window.location.reload();
}

getStats = () => {
    stats = createDiv(`<h2>Statistics</h2>
        <div class = 'img'><img class = 'stats_S' src = '${blocks[0][2]}'></div>
        <div class = 'count'><p>${blocks[0][6]}</p></div>

        <div class = 'img'><img class = 'stats_T' src = '${blocks[1][2]}'></div>
        <div class = 'count'><p>${blocks[1][6]}</p></div>

        <div class = 'img'><img class = 'stats_O' src = '${blocks[2][2]}'></div>
        <div class = 'count'><p>${blocks[2][6]}</p></div>

        <div class = 'img'><img class = 'stats_L' src = '${blocks[3][2]}'></div>
        <div class = 'count'><p>${blocks[3][6]}</p></div>
            
        <div class = 'img'><img class = 'stats_J' src = '${blocks[4][2]}'></div>
        <div class = 'count'><p>${blocks[4][6]}</p></div>

        <div class = 'img'><img class = 'stats_I' src = '${blocks[5][2]}'></div>
        <div class = 'count'><p>${blocks[5][6]}</p></div>

        <div class = 'img'><img class = 'stats_Z' src = '${blocks[6][2]}'></div>
        <div class = 'count'><p>${blocks[6][6]}</p></div>`
    ).size((windowWidth / 10) * 2, windowHeight / 1.65);
    stats.position(windowWidth / 12, windowHeight - (windowHeight / 1.57));
    stats.addClass('stats');
}

getPause = () => {
    pauseScreen = createDiv(`<p id = 'top'>Paused</p>
        <p id = 'small'>Press &nbsp; P &nbsp; to &nbsp; continue</p>
    `).size(canvas.width, canvas.height);
    pauseScreen.position(canvas.x, canvas.y);
    pauseScreen.addClass('pause');
    pauseScreen.hide();
}

getNext = () => {
    next = createDiv('<h2>Next Block</h2>').size((windowWidth / 10) * 2, windowHeight / 3.5);
    next.position(windowWidth - (windowWidth / 3.50), windowHeight / 30); // 
    next.addClass('next');
}

getSubmit = () => {
    submit = createDiv().size((windowWidth / 10) * 2, windowHeight / 7);
    submit.position(windowWidth - (windowWidth / 3.50), windowHeight / 1.22);
    submit.addClass('submit')
}

getRules = () => {
    rules = createDiv(
        `<p id = 'big' >Rules</p>
        <p id = 'small'>&#8596; &nbsp; : &nbsp; Move &nbsp; Block</p>
        <p id = 'small'>&#8595; &nbsp; : &nbsp; Move &nbsp; Down</p>
        <p id = 'small'>Space &nbsp; : &nbsp; Rotate</p>
        <p id = 'small'> M : &nbsp; Toggle &nbsp; Music</p>
        <p id = 'small'> P : &nbsp; Pause</p>

    `).size((windowWidth / 10) * 2, windowHeight / 3);
    rules.position(windowWidth - (windowWidth / 3.50), windowHeight / 2.5);
    rules.addClass('rules');
}

getCurrentScore = () => {
    currentScore = createDiv(`
        <div><p>TOP:</p></div>
        <div><p id = 'res'></p></div>

        <div><p>SCORE:</p></div>
        <div><p id = 'medium'>${score}</p></div>
    `).size((windowWidth / 10) * 2, windowHeight / 4.1);
    currentScore.position(windowWidth / 12, windowHeight / 30); // windowWidth / 12
    currentScore.addClass('score');

}

getGameOver = () => {
    gameOver = createDiv(`
    <h1 id = 'tetrisHeader'>Tetris</h1>
    <p id = 'gameOver'>Game Over</p>
    <button id = 'button' onclick = newGame()>Play Again</button>
    <button id = 'button' onclick = post()>Submit Score</button>
    `).size(canvas.width, canvas.height);
    gameOver.position(canvas.x, canvas.y);
    gameOver.addClass('gameOver');
    gameOver.hide();
}

newStats = () => {

    removeElements();

    getNext();

    getSubmit();

    getRules();

    getCurrentScore();

    getHighscore();

    getStats();

    getPause();

    getGameOver();

}

newBlock = () => {
    
    if (nextBlock === undefined) {

        let firstRandVal = Math.floor(Math.random() * blocks.length)
        activeBlock = blocks[firstRandVal];
        
        blocks[firstRandVal][6] += 1;
        
        newStats();
        
        block = new Block(activeBlock[0], activeBlock[4], activeBlock[5], activeBlock[1]);
        
        // FOR TESTING CERTAIN BLOCKS
        // block = new Block(L_block, (canvas.width / 2), 0, blocks[3][1]);
        
        newRandVal = Math.floor(Math.random() * blocks.length);
        newActiveBlock = blocks[newRandVal];

        nextBlock = newActiveBlock;
        next.html(`<h2>Next Block</h2><img class = ${nextBlock[3]} src = '${nextBlock[2]}'>`)
    }

    else {

        blocks[newRandVal][6] += 1;

        newStats();

        block = new Block(nextBlock[0], nextBlock[4], nextBlock[5], nextBlock[1]);

        newRandVal = Math.floor(Math.random() * blocks.length);
        newActiveBlock = blocks[newRandVal];

        nextBlock = newActiveBlock;
        next.html(`<h2>Next Block</h2><img class = ${nextBlock[3]} src = '${nextBlock[2]}'/>`)
    }
}

moveLeft = () => {
    block.x -= squareSize;
}

moveRight = () => {
    block.x += squareSize;
}

moveUp = () => {
    block.y -= squareSize;  
}

gravity = () => {

    if (!block.collision((square) => square.y === canvas.height - squareSize) && 
        !platform.blocksCollide(block) && pause === false && loss === false) {
        block.y += squareSize;
    }
    else if (pause === false && loss === false) {
        platform.placeBlock(block);
        platform.tetris();
        newBlock();
    }
}
// P5 SETUP
setup = () => {
    canvas = createCanvas(300, 600); // 20
    canvas.class('tetris');
    canvas.position((windowWidth / 2) - (canvas.width / 2), windowHeight / 30);
    
    platform = new Platform();

    // newStats();
    
    newBlock();
    
    // music = ["../audio/Tetris.mp3", "../audio/Role.mp3", "../audio/september.mp3"]

    // audio0 = createAudio(music[0])
    // audio1 = createAudio(music[1])
    // audio2 = createAudio(music[2])
    // audio0.volume(0.1);
    // audio1.volume(0.1);
    // audio2.volume(0.1);
    // audio1.volume(0.1);
    // audio2.volume(0.1);
    
    grav = setInterval( () => gravity(), 600);
    
    // rand = (Math.floor(Math.random() * music.length))
}

// P5 DRAW
draw = () => {

    // if (mute === false) {
    //     if(rand === 0) {
    //         audio0.play();
    //     }
    //     else if(rand === 1) {
    //         audio1.play();
    //     }
    //     else if(rand === 2) {
    //         audio2.play();
    //     }
    // }

    if (loss === true) {
        canvas.remove()
        gameOver.show();
    }
    
    // background('black');
    background('#2D3336');
    platform.show();
    block.show();
    
}

// P5 KEY PRESS
keyPressed = () => {

    // 32 = ASCII FOR SPACE BAR
    if(keyCode === 32 && pause === false && loss === false) {
        block.rotation();
    }

    if (keyCode === 38 && pause === false && loss === false) {
        moveUp();
    }

    // 37 = ASCII FOR LEFT ARROW
    if (keyCode === 37 && pause === false && loss === false && 
        !block.collision((square) => square.x === leftEnd) &&
        !platform.blocksCollide(block, (blockOne, blockTwo) => 
            blockCollision(blockOne, blockTwo), (square) => square.x -= squareSize)) {
                moveLeft();
    }

    // 39 = ASCII FOR RIGHT ARROW
    if (keyCode === 39 && pause === false && loss === false && 
        !block.collision((square) => square.x + squareSize === canvas.width) && 
        !platform.blocksCollide(block, (blockOne, blockTwo) => 
            blockCollision(blockOne, blockTwo), (square) => square.x += squareSize)) {
                moveRight();
    }

    // 40 = ASCII FOR DOWN ARROW
    if (keyCode === 40 && pause === false && loss === false && !block.collision((square) => square.y === canvas.height - squareSize)) {
        gravity();
    }

    if (keyCode === 80 && loss === false) {
        pause = !pause;
        if (pause === true) {
            pauseScreen.show();
        }
        else if (pause === false) {
            pauseScreen.hide();
        }
    }

    if (keyCode === 77) {
        if (mute === false) {
            if(rand === 0) {
                audio0.stop();
            }
            else if(rand === 1) {
                audio1.stop();
            }
            else if(rand === 2) {
                audio2.stop();
            }
            mute = true;
        }
        else if (mute === true) {
            mute = false;
        }   
    }

}

// P5 WINDOW RESIZED
// windowResized = () => {
//     resizeCanvas(windowWidth, windowHeight);
// }

