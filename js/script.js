// importing all classes functions and variables
import * as Utils from "./utility.js";

// canvas element
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const body = document.querySelector('body');

canvas.width = innerWidth;
canvas.height = innerHeight;

// assigning width and height
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;


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


// gameover to store requestanimateframe
let gameOver;


// creating a player instance
let player = new Utils.Player(canvasWidth/2 - 32, canvasHeight/2 + 100, 64, 8, 0, 0, 'normal');


// for all enemies
let ourEnemies = [];

// for all the bullets
let projectiles = [];

// for explosions
let explosions = [];

// summons
let summons = [];

// for area damage
let areaDamages = [];

// for bomb
let bombs = [];

// hut
let huts = [];

// to store the interval
let timeInterval;

// as it takes 1s to run the function firsttime we start with 1
let seconds = 1;



// FUNCTIONS GOES HERE

// we reset all the variable to its inital state when we start a new game
function reset() {
    // adding player
    player = new Utils.Player(canvasWidth/2 - 32, canvasHeight/2 + 100, 64, 8, 0, 0, 'normal');

    // resetting enemies bullets and explosions
    ourEnemies = [];
    projectiles = [];
    explosions = [];
    summons = [];
    areaDamages = [];
    bombs = [];
    huts = [];

    // resetting score and critcal hit count
    gameScore = 0;
    cricalhits = 0;
    bonusPoints = 0;

    // resetting timer and bonus tokens
    seconds = 0;

    // resetting tokens and intervals
    token0 = token1 = token2 = token3 = token4 = false

    interval0 = interval1 = interval2 = interval3 = interval4 = undefined;

    // resetting abilities
    ability1 = ability2 = ability3 = ability4 = false;

    pass1 = pass2 = pass3 = pass4 = true;

    // resetting time dependent functions
    timeInterval = runTime();

    scoreDiv.innerHTML = 'Score: ' +gameScore;


}


// to spawm enemies continously with certain speed and timegap
function spawnEnemies(timegap, speed, posX, posY) {
    return setInterval(() => {

        // here we need to randomize with weights
        // so we get more easy enemies than tough enemies
        if (Math.random() < 0.6) {
            ourEnemies.push(new Utils.Enemy(posX, posY, 60, {x: speed, y: 0}, 200, 'base'));

        }else {
            if (Math.random() < 0.6) {
                console.log('shooter');
                let shooter = new Utils.HealingEnemy(posX, posY, 60, {x:speed, y: 0}, 400, 'healing');
                ourEnemies.push(shooter);

            }else {
                ourEnemies.push(new Utils.DoublingEnemy(posX, posY, 60, {x: speed, y:0}, 600, 'doubling'));

            }
        }
        
    }, timegap);

}


// to display if play scores critical damage
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



// ABILTIES

let pass1, pass2, pass3, pass4;
let ability1, ability2, ability3, ability4;


// ability1
function summonShips() {
    if (ability1) {
        let leftSummon = new Utils.BattleShip(player.posX - 120, player.posY + 20, 60);
        let rightSummon = new Utils.BattleShip(player.posX + 120, player.posY + 20, 60);
        summons.push(leftSummon);
        summons.push(rightSummon);

        let leftInterval = setInterval(() => {
            projectiles.push(leftSummon.shoot());
        }, 500);
        let rightInterval = setInterval(() => {
            projectiles.push(rightSummon.shoot());
        }, 500);

        ability1 = false;
        setTimeout(()=> {
            clearInterval(leftInterval);
            clearInterval(rightInterval);
            summons = [];
            ability1 = true;
        }, 10000)
    }

    
}


// ability2
function arealDestruction() {
    if (ability2) {
        areaDamages.push(new Utils.AreaDamage(player.posX + player.size/2, player.posY + player.size/2, 250, 3));
        
        ability2 = false;

        setTimeout(() => {
            areaDamages.pop();
        }, 7000);

        setTimeout(() => {
            ability2 = true;
        }, 12000);

    }
}


// ability3
function GenerateBombs(vel) {
    if (ability3) {
        bombs.push(new Utils.GrenadeBomb(player.posX + player.size/2, player.posY + player.size/2, 20, vel, 1000, 120));

        ability3 = false;

        setTimeout(() => {
            ability3 = true;
        }, 5000);
    }
}

// ability4
// rage mode
function rageMode() {
    if (ability4) {
        ability4 = false;

        player.speed *= 2;
        player.size *= 1.5;

        summonShips(120);
        summonShips(240);

        player.status = 'rage';

        setTimeout(() => {
            player.speed = 8;
            player.status = 'normal';
            player.size = 64;

        projectiles.forEach(projectile => {
            projectile.damage = 100;
        });
        }, 7000);

        setTimeout(() => ability4 = true, 15000);
    }
}

// tokens to ensure than the condition executes only once
let token0, token1, token2, token3, token4;

// interval to clear as we get to another level
let interval0, interval1, interval2, interval3, interval4; 

let ourInterval1, ourInterval2;

let access = true;


// function to add bonus to increase speed on increasing time
function levelUp() {
    // primary level
    if(seconds < 25 && !token0) {
        token0 = true;
        interval0 = spawnEnemies(1500, 3, 1, 50);
    }

    // medium level
    if (seconds > 25 && seconds < 50 && !token1) {
        bonusPoints += 100
        gameScore += 100;
        token1 = true;

        clearInterval(interval0)
        interval1 = spawnEnemies(1200, 4, 1, 50);
    }

    // hard level
    if (seconds > 50 && seconds < 75 && !token2) {
        bonusPoints += 150
        gameScore += 150;
        token2 = true;

        clearInterval(interval1);
        interval2 = spawnEnemies(1000, 4, 1, 50);
    }

    // expert level
    if (seconds > 75 && seconds < 100 && !token3) {
        bonusPoints += 300
        gameScore += 300;
        token3 = true

        clearInterval(interval2);
        interval3 = spawnEnemies(800, 5, 1, 50); 
    }

    // god level
    if (seconds > 100 && !token4) {
        bonusPoints += 1000;
        gameScore += 1000;
        token4 = true;

        clearInterval(interval3);

    }


    // unlocking abilities based on score
    if (gameScore >= 250 && pass1) {
        ability1 = true;
        pass1 = false;
    }

    if (gameScore >= 750 && pass2) {
        ability2 = true;
        pass2 = false;
    }

    if (gameScore >= 1500 && pass3) {
        ability3 = true;
        pass3 = false;
    }

    if (gameScore >= 2500 && pass4) {
        ability4 = true;
        pass4 = false;
    }


    // to make boss level every 100 seconds
    if (seconds % 100 == 0) {
        console.log('level ok!');

        setTimeout(() => {
            ourEnemies = [];
        }, 0)

        setTimeout(() => {
            let boss = new Utils.BossEnemy(25, 100, 256, {x:0.5, y: 0}, 7000, 'boss');

            setInterval( () => {
                if (boss.hitpoints > 0 && boss.hitpoints < 7000) {
                    boss.hitpoints += 1000;
                }
            }, 5000);

            ourEnemies.push(boss);
            access = true;


            let hut = new Utils.Hut(canvasWidth/6, 100, 60, 10000,  1500);
            let hut2 = new Utils.Hut(canvasWidth - canvasWidth/6, 100, 60, 10000,  1500);

            huts.push(hut);
            huts.push(hut2);

            ourInterval1 = spawnEnemies(1500, 2, hut.posX + hut.size/2, hut.posY + hut.size/2);
            ourInterval2 = spawnEnemies(1500, 2, hut2.posX + hut2.size/2, hut2.posY + hut2.size/2);


            if (interval4 !== undefined) {
                console.log(' interval4 ok');
                clearInterval(interval4);
                
            }
        }, 500)
        
    }

    

}


function enemyKill(enemy, index) {
    if (enemy.hitpoints <= 0) {
        if (enemy.type === 'doubling') {
            gameScore += 40;
            setTimeout(() => {
                ourEnemies.splice(index, 1);
            }, 0);

            ourEnemies.push(new Utils.Enemy(enemy.posX - 70, enemy.posY, 60, enemy.velocity, 200, 'base'));
            ourEnemies.push(new Utils.Enemy(enemy.posX + 70, enemy.posY, 60, enemy.velocity, 200, 'base'));

        }else if (enemy.type === 'base') {
            gameScore += 10
            setTimeout(() => {
                ourEnemies.splice(index, 1);
            }, 0);
        }
        else if (enemy.type === 'healing') {
            gameScore += 30;
            setTimeout(() => {
                ourEnemies.splice(index, 1);
            }, 0);
        }

        else if(enemy.type === 'boss') {

            clearInterval(ourInterval1);
            clearInterval(ourInterval2);

            gameScore += 1500
            setTimeout(() => {
                ourEnemies.splice(index, 1);
                ourEnemies = [];
                huts = [];
            }, 0);

            // only once token
            if (access) {
                interval4 = spawnEnemies(700, 6, 1, 50);
                access = false;
            }
            
        }
    }
}


// this is the main function
function update() {
   
    // to clear the screen for every frame
    Utils.clearScreen();
    gameOver = requestAnimationFrame(update);

    player.drawPlayer();

    player.move();


    // huts draw
    huts.forEach(hut => {
        hut.draw();
    })


    // for summon ability
    summons.forEach((summon, index) => {
        summon.draw();
    })

    bombs.forEach((bomb, bombIndex) => {
        bomb.move();

        // removing unused projectiles when it moves outside the canvas
        if(bomb.posX + bomb.size < 0 || bomb.posX - bomb.size > canvasWidth ||
            bomb.posY + bomb.size < 0 || bomb.posY - bomb.size > canvasHeight) {
            setTimeout(() => {
                bombs.splice(bombIndex, 1);
            }, 0)
        }    

    })

    // for area damage ability
    areaDamages.forEach(areaDamage => {
        areaDamage.draw(player.posX + player.size/2, player.posY + player.size/2);

        ourEnemies.forEach((enemy, index) => {

            let dist = Math.hypot(enemy.posX + enemy.size/2 - player.posX - player.size/2,
                 enemy.posY + enemy.size/2 - player.posY - player.size/2)

            if (dist < areaDamage.radius) {
                enemy.hitpoints -= areaDamage.damage;

                if (enemy.type === 'healing') {
                    setTimeout(() => {
                        enemy.hitpoints += areaDamage.damage/2;
                    }, 200)
                }
    
    
                enemyKill(enemy, index);
            }

            
        })

        
    })


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
    

    ourEnemies.forEach((enemy, index) => {
        enemy.move();

        // for detecting bullet
        projectiles.forEach((projectile, projindex) => {
            let dist = Math.hypot(projectile.posX - enemy.posX - enemy.size/2, projectile.posY - enemy.posY - enemy.size/2);
            

            // normal hit
            if(dist < enemy.size/2 && dist > enemy.size/3) {

                // adding damage
                enemy.hitpoints -= projectile.damage;

                if (enemy.type === 'healing') {
                    setTimeout(() => {
                        enemy.hitpoints += projectile.damage/2;
                    }, 200)
                }
    
                // to avoid flashing
                setTimeout(() => {
                    projectiles.splice(projindex, 1);
                }, 0);

                enemyKill(enemy, index);

                
                // generating explosion
                for(let i = 0; i < 10; i++) {
                    explosions.push(new Utils.Explosion(projectile.posX, projectile.posY, (Math.random() * 3) + 2, {x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4}))
                }

                // adding sound

                Utils.makeSound(Utils.addSound('audios/170144__timgormly__8-bit-explosion2.wav', 'explode'));
                
            }

            // critical hit
            if(dist < enemy.size/3) {

                cricalhits++;

                enemy.hitpoints -= projectile.damage * 2;

                if (enemy.type === 'healing') {
                    setTimeout(() => {
                        enemy.hitpoints += projectile.damage/2;
                    }, 200)
                }
    
                setTimeout(() => {
                    projectiles.splice(projindex, 1);
                }, 0);


                enemyKill(enemy, index);

                // to display it
                cricalhitDiv.style.color = 'rgb(230, 11, 11, 1)';
                displayCritical();


                // generating explosion
                for(let i = 0; i < 10; i++) {
                    explosions.push(new Utils.Explosion(projectile.posX, projectile.posY, (Math.random() * 3) + 2, {x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4}))
                }

                Utils.makeSound(Utils.addSound('audios/170144__timgormly__8-bit-explosion2.wav', 'explode'));
            }
        })


        bombs.forEach((bomb, bombIndex) => {


            let dist = Math.hypot(bomb.posX - enemy.posX - enemy.size/2, bomb.posY - enemy.posY - enemy.size/2);


            if(dist < bomb.impactRadius) {

                // adding damage
                if (enemy.type === 'boss') {
                    enemy.hitpoints -= 20;

                }else {
                    enemy.hitpoints -= bomb.damage;

                }
                

                if (enemy.type === 'healing') {
                    setTimeout(() => {
                        enemy.hitpoints += bomb.damage/2;
                    }, 200)
                }
    
    
                enemyKill(enemy, index);

                
                // generating explosion
                for(let i = 0; i < 10; i++) {
                    explosions.push(new Utils.Explosion(bomb.posX, bomb.posY, (Math.random() * 3) + 2, {x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4}))
                }

                // adding sound
                Utils.makeSound(Utils.addSound('audios/170144__timgormly__8-bit-explosion2.wav', 'explode'));
                
            }
        })



        // for the shooting enemy

        // for player and enemies collision and gameover
        let dist = Math.hypot(enemy.posX + enemy.size/2 - player.posX - player.size/2, enemy.posY + enemy.size/2 - player.posY -player.size/2);

        if(dist < (enemy.size + player.size)/2 && player.status === 'normal') {
            // console.log(dist);
            
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

            clearInterval(timeInterval);
            clearInterval(interval0);
            clearInterval(interval1);
            clearInterval(interval2);
            clearInterval(interval3);
            clearInterval(interval4);

            // adding sound
            

            // adding soun
            
            Utils.makeSound(Utils.addSound('audios/391539__mativve__electro-win-sound.wav', 'win'));

            scoreBoard.style.display = 'flex';   
        }
    })



    explosions.forEach((explosion, index) => {
        explosion.move();

        if (explosion.alpha < 0) {
            explosions.splice(index, 1);
        }
    })



    scoreDiv.innerHTML = 'Score: ' + gameScore;
    
}


// ALL EVENT LISTENERS GOES HERE
// key board events


document.addEventListener('keydown', (e) => {
    console.log(e.key);
    if(e.key === 'ArrowUp' || e.key === 'Up' || e.key === 'w') {
        player.dy = -player.speed

    }else if (e.key === 'ArrowDown' || e.key === 'Down' || e.key === 's') {
        player.dy = player.speed

    }else if (e.key === 'ArrowLeft' || e.key === 'Left' || e.key === 'a') {
        player.dx = -player.speed

    }else if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'd') {
        player.dx = player.speed
    }


    // ability activations

    // ability1 -- to summon batleships
    if(e.key === 'b') {
        summonShips();
    }

    // ability2 -- radial damage circle
    if (e.key === 'c') {
        arealDestruction();
    }

    // ability3 -- destruction bomb
    if (e.key === ' ') {
        GenerateBombs({x:0, y:-7});
    }

    // ability4 -- rage mode
    if (e.key === 'r') {
        rageMode();
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

    // for projectie
    const angle = Math.atan2(e.clientY - player.posY - player.size/2 , e.clientX - player.posX - player.size/2);

    let speed = 15
    const velocity = {
        x: speed * Math.cos(angle),
        y: speed * Math.sin(angle)
    }

    let size = 6;
    let damage = 100;
    if (player.status === 'rage') {
        size = 12;
        damage = 300;
        speed = 20;

    }

    projectiles.push(new Utils.Projectile(player.posX + player.size/2, player.posY + player.size/2, size, velocity, damage));


    // adding sound
    Utils.makeSound(Utils.addSound('audios/348163__djfroyd__laser-one-shot-2.wav', 'bullet'));


})


// event listener for the start button
startGameBtn.addEventListener('click', () => {
    scoreBoard.style.display = 'none';

    // to reset all the values
    reset();
    // to start rendering the screen
    update();

})
