// canvas element
const canvas = document.querySelector('canvas');
const body = document.querySelector('body');

canvas.width = innerWidth;
canvas.height = innerHeight;

const ctx = canvas.getContext('2d');


// assigning width and height
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;


// spaceship-PLAYER
const spaceship = document.querySelector('#spaceship');

// alien-ENEMY
const alien = document.querySelector('#alien');

// to store the score
let gameScore = 0;
const scoreDiv = document.querySelector('#score');

// to show if player gets critcal hits
const cricalhitDiv = document.querySelector('#critical');

// timer
const timeSpan = document.querySelector('#time');


// score-board
const scoreBoard = document.querySelector('.score-board');

// all info inside scoreboard
const gameScoreDisplay = document.querySelector('#game-score');

let cricalhits = 0;
const criticHitsDisplay = document.querySelector('#critic-hits');

let bonusPoints = 0;
const bonus = document.querySelector('#bonus');

const timeSurvived = document.querySelector('#time-survived');

let highScore = 0;
const highScoreDisplay = document.querySelector('#high-score');


// game start btn
const startGameBtn = document.querySelector('#start');


// tokens to ensure than the condition executes only once
let token0, token1, token2, token3, token4;
token0 = token1 = token2 = token3 = token4 = false;

// interval to clear as we get to another level
let interval0, interval1, interval2, interval3, interval4; 

// to slow down the speed of explosion
const friction = 0.99;


// ALL ARRAYS

// for all enemies
let ourEnemies = [];

// for all the bullets
let projectiles = [];

// for explosions
let explosions = [];


// to store the interval
let timeInterval;

// as it takes 1s to run the function firsttime we start with 1
let seconds = 1;



// ALL CLASSES GOES HERE

// player class for player
class Player {
    constructor(posX, posY, size, speed, dx ,dy) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.speed = speed;
        this.dx = dx;
        this.dy = dy;
    }

    drawPlayer() {
        ctx.drawImage(spaceship, this.posX, this.posY, this.size, this.size);
    }

    // detecting collision for player
    detectCollision() {
        if (this.posX  < 0) {
            this.posX = 0;
        }
        if (this.posX + this.size > canvasWidth) {
            this.posX = canvasWidth - this.size;
        }
        if (this.posY + this.size > canvasHeight) {
            this.posY = canvasHeight - this.size;
        }
        if(this.posY < 0) {
            this.posY = 0;
        }
    }


// movement of player
    movePos() {
        this.posX += this.dx;
        this.posY += this.dy;
        this.detectCollision();
    }
}


// creating projectile class
class Projectile {
    constructor(posX, posY, size, velocity) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.size, 0, Math.PI * 2, true);
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    move() {
        this.draw();
        this.posX = this.posX +  this.velocity.x;
        this.posY = this.posY + this.velocity.y;
    }
}


// for explosion
class Explosion {
    constructor(posX, posY, size, velocity) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.size, 0, Math.PI * 2, true);
        ctx.fillStyle = 'orange';
        ctx.fill();
        ctx.restore();
    }

    move() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.posX = this.posX +  this.velocity.x;
        this.posY = this.posY + this.velocity.y;

        if(this.alpha > 0.01) {
            this.alpha -= 0.01;
        }else {
            this.alpha = 0;
        }
        
    }
}


// class for enemies
class Enemy {
    constructor(posX, posY, size, velocity) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.velocity = velocity;
    }

    draw() {       
        ctx.drawImage(alien, this.posX, this.posY, this.size, this.size);
    }

    move() {
        this.draw();
        this.posX = this.posX +  this.velocity.x;
        this.posY = this.posY + this.velocity.y;

        if (this.posX < 0) {
            this.posY += this.size + 5;
            this.velocity.x *= -1;
        }

        if(this.posX + this.size > canvasWidth) {
            this.posY += this.size + 5;
            this.velocity.x *= -1;
        }
    }
}


// creating a player instance
let player = new Player(canvasWidth/2 - 32, canvasHeight/2 + 100, 64, 8, 0, 0);



// ALL FUNCTIONS GOES HERE


// we reset all the variable to its inital state when starting a new game
function reset() {
    player = new Player(canvasWidth/2 - 32, canvasHeight/2 + 100, 64, 8, 0, 0);

    // resetting enemies bullets and explosions
    ourEnemies = [];
    projectiles = [];
    explosions = [];

    // resetting score and critcal hit count
    gameScore = 0;
    cricalhits = 0;
    bonusPoints = 0;

    // resetting timer and bonus tokens
    seconds = 0;

    // resetting tokens and intervals
    token0 = token1 = token2 = token3 = token4 = false

    interval0 = interval1 = interval2 = interval3 = interval4 = undefined;

    timeInterval = runTime();

    scoreDiv.innerHTML = 'Score: ' +gameScore;


}


// to spawm enemies continously with certain speed and timegap
function spawnEnemies(timegap, speed) {
    return setInterval(() => {
        ourEnemies.push(new Enemy(50, 50, 60, {x: speed, y: 0}));
    }, timegap)

}


function displayCritical() {
    setInterval(() => {
        cricalhitDiv.style.color = 'rgb(230, 11, 11, 0)';
    }, 1500);

}



// for running time
function runTime() {
    return setInterval(()=> {
        timeSpan.innerHTML = seconds + 's';
        seconds++

        // to add difficulty as time passes
        levelUp();
    },1000)
}



// function to add bonus to increase speed on increasing time
function levelUp() {

    // primary level
    if(seconds < 25 && !token0) {
        token0 = true;
        interval0 = spawnEnemies(1500, 4);
    }
    // medium level
    if (seconds > 25 && seconds < 50 && !token1) {
        bonusPoints += 100
        gameScore += 100;
        token1 = true;

        clearInterval(interval0)
        interval1 = spawnEnemies(1200, 5);
    }

    // hard level
    if (seconds > 50 && seconds < 75 && !token2) {
        bonusPoints += 150
        gameScore += 150;
        token2 = true;

        clearInterval(interval1);
        interval2 = spawnEnemies(1000, 5);
    }

    // expert level
    if (seconds > 75 && seconds < 100 && !token3) {
        bonusPoints += 300
        gameScore += 300;
        token3 = true

        clearInterval(interval2);
        interval3 = spawnEnemies(800, 6); 
    }

    // god level
    if (seconds > 100 && !token4) {
        bonusPoints += 1000;
        gameScore += 1000;
        token4 = true;

        clearInterval(interval3);
        interval4 = spawnEnemies(700, 7);
    }
}


// MANAGING AUDIO
// for adding audio
function addSound(src, id) {
    let sound = document.createElement('audio');
    sound.setAttribute('autoplay', 'true');
    sound.setAttribute('id', id);
    let source = document.createElement('source');
    source.setAttribute('src', src);
    source.setAttribute('type', 'audio/wav');
    sound.appendChild(source);
    return sound;
}


// for playing audio
function makeSound(sound) {
    let soundId = "#" + sound.id
    let allSounds = document.querySelectorAll(soundId);

    let ourArray = Array.from(allSounds);

    if (ourArray.length > 0) {
        let prevSound = ourArray.pop();
        body.removeChild(prevSound);
    }

    body.appendChild(sound);
}



// to clear the screen after every frame
function clearScreen() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}


// GAME OVER VARIABLE TO CONTROL ANAIMATION FRAMES
let gameOver;



// THE MAIN FUNCTION WHICH RUNS AGAIN AND AGAIN
function update() {
   
    // to clear the screen for every frame
    clearScreen();

    // storing animation to a variable so we can change it later
    gameOver = requestAnimationFrame(update);

    // to draw the player
    player.drawPlayer();

    // to move the player
    player.movePos();



    // rendering projectiles
    projectiles.forEach((projectile, index) => {
        projectile.move();

        // removing unused projectiles when it moves outside the canvas
        if(projectile.posX + projectile.size < 0 || projectile.posX - projectile.size > canvasWidth ||
            projectile.posY + projectile.size < 0 || projectile.posY - projectile.size > canvasHeight) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0)
        }
    })
    

    // rendering enemies
    ourEnemies.forEach((enemy, index) => {
        enemy.move();

        // for detecting bullet
        projectiles.forEach((projectile, projindex) => {
            let dist = Math.hypot(projectile.posX - enemy.posX - enemy.size/2, projectile.posY - enemy.posY - enemy.size/2);
            

            // normal hit
            if(dist < enemy.size/2 + projectile.size && dist > enemy.size/3 + projectile.size) {

                gameScore += 5

                // to avoid flashing
                setTimeout(() => {
                    ourEnemies.splice(index, 1);
                    projectiles.splice(projindex, 1);
                }, 0)


                // generating explosion
                for(let i = 0; i < 10; i++) {
                    explosions.push(new Explosion(projectile.posX, projectile.posY, (Math.random() * 3) + 2, {x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4}))
                }

                // adding sound

                makeSound(addSound('audios/170144__timgormly__8-bit-explosion2.wav', 'explode'));
                
            }

            // critical hit
            if(dist < enemy.size/3 + projectile.size) {

                gameScore += 20;
                cricalhits++;

                setTimeout(() => {
                    ourEnemies.splice(index, 1);
                    projectiles.splice(projindex, 1);
                }, 0)

                // to display it
                cricalhitDiv.style.color = 'rgb(230, 11, 11, 1)';
                critical.style.color = 'rgb(230, 11, 11, 1)';
                displayCritical();


                // generating explosion
                for(let i = 0; i < 10; i++) {
                    explosions.push(new Explosion(projectile.posX, projectile.posY, (Math.random() * 3) + 2, {x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4}))
                }

                makeSound(addSound('audios/170144__timgormly__8-bit-explosion2.wav', 'explode'));
            }
        })


        // game over if player and enemies collide
        let dist = Math.hypot(enemy.posX + enemy.size/2 - player.posX - player.size/2, enemy.posY + enemy.size/2 - player.posY -player.size/2);

        if(dist < (enemy.size + player.size)/2) {
            
            // to stop rendering again and again
            cancelAnimationFrame(gameOver);

            // updating info
            gameScoreDisplay.innerHTML = gameScore;

            criticHitsDisplay.innerHTML = cricalhits;
            timeSurvived.innerHTML = timeSpan.innerHTML;
            bonus.innerHTML = bonusPoints;

            if (highScore < gameScore) {
                highScore = gameScore;
            }

            highScoreDisplay.innerHTML = highScore;

            // clearing all intervals as game ends
            clearInterval(timeInterval);
            clearInterval(interval0);
            clearInterval(interval1);
            clearInterval(interval2);
            clearInterval(interval3);
            clearInterval(interval4);

            // adding sound
            makeSound(addSound('audios/391539__mativve__electro-win-sound.wav', 'win'));

            // making it display again
            scoreBoard.style.display = 'flex';   
        }
    })


    // for rendering explosion particles
    explosions.forEach((explosion, index) => {
        explosion.move();

        if (explosion.alpha < 0) {
            explosions.splice(index, 1);
        }
    })


    // displaying score
    scoreDiv.innerHTML = 'Score: ' + gameScore;   
}


// ALL EVENT LISTENERS GOES HERE


// key board events
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowUp' || e.key === 'Up' || e.key === 'w') {
        player.dy = -player.speed

    }else if (e.key === 'ArrowDown' || e.key === 'Down' || e.key === 's') {
        player.dy = player.speed

    }else if (e.key === 'ArrowLeft' || e.key === 'Left' || e.key === 'a') {
        player.dx = -player.speed

    }else if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'd') {
        player.dx = player.speed
    }
});


document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'Up' || e.key === 'w' ||
        e.key === 'ArrowDown' || e.key === 'Down' || e.key === 's' ||
        e.key === 'ArrowLeft' || e.key === 'Left' || e.key === 'a' ||
        e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'd') {
        player.dx = 0;
        player.dy = 0;
    }
});


// click events
document.addEventListener('click', (e) => {
    const angle = Math.atan2(e.clientY - player.posY - player.size/2 , e.clientX - player.posX - player.size/2);

    const velocity = {
        x: 15 * Math.cos(angle),
        y: 15 * Math.sin(angle)
    }
    projectiles.push(new Projectile(player.posX + player.size/2, player.posY + player.size/2, 6, velocity));


    // adding sound
    makeSound(addSound('audios/348163__djfroyd__laser-one-shot-2.wav', 'bullet'));

})



// EVENT LISTENER FOR START BTN
startGameBtn.addEventListener('click', () => {
    scoreBoard.style.display = 'none';

    // to reset all the values
    reset();
    // to start rendering the screen
    update();
})