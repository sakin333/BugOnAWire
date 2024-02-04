const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

const myFont = new FontFace('myFont', 'url(assets/static/Honk-Regular.ttf)')

let gameState = 'start' //start, playing or gameover
let jumped = false
let gameSpeed = 2
let birdInterval

//start screen bug image
const startScreenBugImage = new Image()
startScreenBugImage.src = './assets/startScreenBug.png'

//image for bug flying
const bugJumpedImage = new Image()
bugJumpedImage.src = './assets/bugFly.png'

//image for bird
const birdImage = new Image();
birdImage.src = './assets/birdd.png';

const backgroundImage = new Image()
backgroundImage.src = './assets/jungleBackground.png'

let wires = []
let startScreenBug = {
    x: canvas.width / 2 - 30,
    y: canvas.height / 2 + 110,
    width: 50,
    height: 50,
    isJumping: false,
    jumpHeight: 40,
    jumpSpeed: 2
}
let bug = { x: canvas.width / 2 - 70, y: canvas.height - 70, width: 40, height: 40 }
let birds = []
let poles = []
let startBugY = canvas.height / 2 - 40;

function drawStartScreen() {
    ctx.clearRect(0, 0 , canvas.width, canvas.height)

    //Draw wire
    drawStartScreenWire()

    //Draw background image
    drawBackgroundImage()

    // Draw Bug on Wire title
    gameTitle()

    // Draw bug on wire as the title
    drawStartScreenBug(startScreenBug.x, startScreenBug.y)

    gameState === 'start' && requestAnimationFrame(drawStartScreen)
}

function drawStartScreenBug(x,y) {
    jumpBug()
    ctx.drawImage(startScreenBugImage, x, y , startScreenBug.width, startScreenBug.height)
}

function drawBackgroundImage() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
}

function drawStartScreenWire() {
    ctx.fillStyle = '#A52A2A';
    ctx.fillRect(0, canvas.width / 2, canvas.width, canvas.width / 150);
}

function gameTitle() {
    ctx.font = "80px myFont";
    ctx.fillText("Bug on Wire", canvas.width / 2 - 200, canvas.height / 2 - 50);

    // Display start message
    ctx.font = "30px myFont";
    ctx.fillStyle = "black";
    ctx.fillText("Press Enter to start", canvas.width / 2 - 130, canvas.height / 2 + 50);
}

function jumpBug() {
    if(!startScreenBug.isJumping) {
        // console.log('jumping')
        // console.log(startScreenBug)
        startScreenBug.isJumping = true
        let jumpCount = 0

        const jumpInterval = setInterval(() => {
            startScreenBug.y -= startScreenBug.jumpSpeed
            jumpCount++

            if(jumpCount >= startScreenBug.jumpHeight / startScreenBug.jumpSpeed) {
                clearInterval(jumpInterval)
                fallBug()
            }
        }, 20)
    }
}

function fallBug() {
    const fallInterval = setInterval(() => {
        startScreenBug.y += startScreenBug.jumpSpeed

        if(startScreenBug.y >= canvas.height / 2 + 110) {
            startScreenBug.y = canvas.height / 2 + 110
            startScreenBug.isJumping = false
            clearInterval(fallInterval)
        }
    }, 20)
}

function startGame() {
    gameState = 'playing'
    spawnPole()

    spawnBirdsLoop()
    drawGame()
}

//draw pole at position (x,y)
function drawPole(x, y) {
    ctx.fillStyle = '#ccc'; // SaddleBrown color for poles
    const poleHeight = 10;
    const poleWidth = 30;

    // Draw pole
    ctx.fillRect(x - poleWidth/2 + 3, y, poleWidth, poleHeight);
}

function drawBird(x,y) {
    ctx.drawImage(birdImage, x, y, 60, 60)
}


//function to draw bird at position (x,y)
function spawnPole() {
    poles = [];

    // calculate the middle of the canvas
    const middleX = canvas.width / 2;

    // set the number of wires and spacing between them
    const numberOfWires = 4;
    const wireSpacing = 100;

    // xalculate the starting position for the first wire
    const startingX = middleX - (numberOfWires - 1) * wireSpacing / 2;

    for (let i = 0; i < numberOfWires; i++) {
        const wireX = startingX + i * wireSpacing;
        wires.push(wireX)
        let pole = { x: wireX, y: 0 };
        poles.push(pole);
    }
    console.log('wires',wires)
    // birdInterval = setInterval(spawnBirds, 1000)
    // console.log('birds array',birds)
}

let randomWire

// function to spawn a bird at a random wire
function spawnBirds() {
        randomWire = Math.floor(Math.random() * wires.length)
        // let birdY = 0-Math.floor(Math.random() * 200);
        let birdY = 0-(Math.random() * 200);

        let bird = {
            x: wires[randomWire] - 12,
            y: birdY
        }

        birds.push(bird)
}

// let lastSpawnTime = 0;
// const spawnInterval = 1000;

//function to continuously spawn birds using requestAnimationFrame
// function spawnBirdsLoop(timestamp) {
//     if (timestamp - lastSpawnTime >= spawnInterval) {
//         spawnBirds();
//         lastSpawnTime = timestamp;
//     }
//     requestAnimationFrame(spawnBirdsLoop);
// }

// spawnBirdsLoop()

let lastSpawnTime = 0;
const baseSpawnInterval = 1000; // Base interval in milliseconds
let spawnInterval = baseSpawnInterval;

function spawnBirdsLoop(timestamp) {
    if (timestamp - lastSpawnTime >= spawnInterval) {
        spawnBirds();

        // Increase the probability of spawning more birds over time
        if (gameSpeed > 2) {
            spawnInterval = baseSpawnInterval / (gameSpeed - 1);
        }

        lastSpawnTime = timestamp;
    }
    requestAnimationFrame(spawnBirdsLoop);
}

// spawnBirdsLoop();


// function to draw a wire at position (x)
function drawWire(x) {
    const wireWidth = canvas.width / 150; // Adjust as needed
    ctx.fillStyle = '#A52A2A';
    ctx.fillRect(x - wireWidth / 2, 0, wireWidth, canvas.height);
}

// array to store bug animation frames
const bugFrames = []
for(let i = 1 ; i<=10 ; i++) {
    const bugImage = new Image()
    bugImage.src = `./assets/bug${i}.png`
    bugFrames.push(bugImage)
}
let currentBugFrameIndex = 0
let bugAnimationFrame = 0


// function to draw the bug with animation
function drawBug(x,y) {
    if(jumped) {
        ctx.drawImage(bugJumpedImage, x, y, bug.width, bug.height)
    } else {
        const currentBugFrame = bugFrames[currentBugFrameIndex]
        ctx.drawImage(currentBugFrame, x, y, bug.width, bug.height)
        bugAnimationFrame += 0.3

        if(bugAnimationFrame > 1){
            currentBugFrameIndex = (currentBugFrameIndex + 1) % bugFrames.length
            bugAnimationFrame = 0
        }
    }
}

//function to move the bug left
function moveLeft() {
    if(bug.x > wires[0]) {
        bug.x -= 100
    }
}

//function to move the bug right
function moveRight() {
    if(bug.x < wires[2]) {
        bug.x += 100
    }
}

//function to make the bug jump
function jump() {
    if(!jumped) {
        jumped = true
        bug.width = 50
        bug.height = 50
    }

    setTimeout(() => {
        jumped = false
        bug.width = 40
        bug.height = 40
    }, 500)
}

let crashed = false

//function to check for collision between bug and birds
function crashWith(birds) {
    for (let i = 0; i < wires.length; i++) {
        if (wires[i] === bug.x + 20) {
            // console.log('inside',wires[i])
            for (let j = 0; j < birds.length; j++) {
                if((wires[i] === birds[j].x + 12)) {
                    // console.log(`wires: ${wires[i]} birdsx: ${birds[j].x + 12} bugx: ${bug.x + 20}`)
                    let bugLeft = bug.x;
                    let bugRight = bug.x + bug.width;
                    let bugTop = bug.y + bug.height/3;
                    let bugBottom = bug.y + bug.height;

                    let birdLeft = birds[j].x;
                    let birdRight = birds[j].x + 40;
                    let birdTop = birds[j].y;
                    let birdBottom = birds[j].y + 40;
                   
                    if (!(bugBottom < birdTop || bugTop > birdBottom || bugRight < birdLeft || bugLeft > birdRight)) {
                        console.log('function: ', crashed)
                        crashed = true;
                        break;
                    }
                }
            }
            break;
        }
    }
    return crashed;
}

// function crashWith(birds) {
//     for (let j = 0; j < birds.length; j++) {
//         let bugLeft = bug.x;
//         let bugRight = bug.x + bug.width;
//         let bugTop = bug.y + bug.height / 3;
//         let bugBottom = bug.y + bug.height;

//         let birdLeft = birds[j].x;
//         let birdRight = birds[j].x + 40;
//         let birdTop = birds[j].y;
//         let birdBottom = birds[j].y + 40;

//         if (
//             bugBottom > birdTop &&
//             bugTop < birdBottom &&
//             bugRight > birdLeft &&
//             bugLeft < birdRight
//         ) {
//             console.log('function: ', crashed);
//             crashed = true;
//             // clearInterval(birdInterval);
//             break;
//         }
//     }
//     return crashed;
// }

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // birds = []

    calculateTime();

    // Draw wires
    wires.forEach((wireX) => {
        drawWire(wireX);
    });

    // Draw poles
    poles.forEach((pole) => {
        pole.y += gameSpeed;

        if (bug.y < pole.y + 20) {
            jump();
        }

        if (pole.y > canvas.height) {
            pole.y = 0;
        }

        drawPole(pole.x, pole.y);
    });

    // Draw birds
    console.log(birds)
    birds.forEach((bird) => {
        bird.y += gameSpeed;
        if (bird.y > canvas.height) {
            birds.splice(birds[randomWire], 1);
            // let newBirdY = 0-Math.floor(Math.random() * 200);
            // bird.y = newBirdY;
        }
        drawBird(bird.x, bird.y);
    });

    // Draw bug
    drawBug(bug.x, bug.y);

    // Check for collision after drawing
    if (crashWith(birds) && crashed) {
        gameOver();
        console.log("game over");
        gameState = 'gameover'
        gameOver1 = true;
    } else {
        requestAnimationFrame(drawGame);
    }
}



let hour = 0; 
let minute = 0; 
let second = 0; 
let count = 0;

let score = {
    msec : "",
    sec : "",
    min : "",
    hr : "",
}


function calculateTime() {
    count++

    if(count == 100) {
        second++
        count = 0

        gameSpeed += 0.05
    }
    if(second == 60) {
        minute++
        second = 0
    }

    if(minute == 60) {
        hour++
        minute=0
        second=0
    }

    let hrString = hour; 
    let minString = minute; 
    let secString = second; 
    let countString = count; 
  
    if (hour < 10) { 
        hrString = "0" + hrString; 
    } 
  
    if (minute < 10) { 
        minString = "0" + minString; 
    } 
  
    if (second < 10) { 
        secString = "0" + secString; 
    } 
  
    if (count < 10) { 
        countString = "0" + countString; 
    } 

    score.msec = countString
    score.sec = secString
    score.min = minString
    score.hr = hrString

    ctx.font = "bolder 40px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`${hrString}:${minString}:${secString}:${count}`, 10, 50)
  
}

function gameOver() {
    ctx.font = "100px myFont";
    ctx.fillText("Game Over", canvas.width / 2 - 210, canvas.height / 2 - 50)
    ctx.clearRect(canvas.width / 2 - 80,canvas.height / 2 + 10, 200, 100)
    ctx.font = "bolder 30px Arial";
    ctx.fillStyle = "black"
    ctx.fillText('You survived',canvas.width / 2 - 100 ,canvas.height / 2 + 50)
    ctx.fillText(`${score.hr}:${score.min}:${score.sec}:${score.msec}`,canvas.width / 2 - 80, canvas.height / 2 + 100)
    ctx.font = "30px myFont";
    ctx.fillText("Press SPACE to restart", canvas.width / 2 - 154,canvas.height / 2 + 140)
}

let gameOver1 = false

function restartGame() {
    if(gameOver1) {
        hour = 0
        minute = 0
        second = 0
        count = 0
        birds= []
        wires= []
        crashed = false
        gameSpeed = 2
        gameState = 'start'
        // spawnPole()
        gameOver1 = false
        // drawGame()
        startGame()
    }
}

function handleKeyDown(event) {
    if(gameState === 'start' && event.keyCode === 13) {
        startGame()
    }else if(gameState === 'playing') {
        switch (event.keyCode) {
            case 37:
                moveLeft();
                break;
            case 39:
                moveRight();
                break;
            case 38:
                jump();
                break;
            // case 32:
            //     restartGame();
            //     break;
        }
    } else if(gameState === 'gameover' && event.keyCode === 32) {
        restartGame()
    }
}

Promise.all([...bugFrames, bugJumpedImage, birdImage, startScreenBugImage].map(img => new Promise(resolve => img.onload = resolve)))
.then(() => {
    myFont.load().then((font) => {
        document.fonts.add(font)
        drawStartScreen()
    })
    // drawGame()
    // spawnPole()
    window.addEventListener('keydown', handleKeyDown)
})



