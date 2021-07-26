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

// to display critical hits
let cricalhits = 0;
const criticHitsDisplay = document.querySelector('#critic-hits');

// to display bonus points
let bonusPoints = 0;
const bonus = document.querySelector('#bonus');


// enemies kill count
let enemiesKilled = 0;
let enemiesKilledSpan = document.querySelector('#enemies');
let DoublingEnemyKilled = 0;
let DoublingEnemyKilledSpan = document.querySelector('#doubling-enemy');
let HealingEnemyKilled = 0;
let HealingEnemyKilledSpan = document.querySelector('#healing-enemy');
let BossEnemyKilled = 0;
let BossEnemyKilledSpan = document.querySelector('#boss-enemy');
// to display time survived
const timeSurvived = document.querySelector('#time-survived');

// to display high score
let highScore = 0;
const highScoreDisplay = document.querySelector('#high-score');

// game start btn
const startGameBtn = document.querySelector('#start');

// gameover to store requestanimateframe
let gameOver;


// creating a player instance
let player = new Utils.Player(canvasWidth/2 - 32, canvasHeight/2 + 100, 64, 8, 0, 0, 'normal');


// ALL ARRAYS GOES HERE

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

    // resetting score and critcal hit count
    gameScore = 0;
    cricalhits = 0;
    bonusPoints = 0;
    enemiesKilled = 0;
    DoublingEnemyKilled = 0;
    HealingEnemyKilled = 0;
    BossEnemyKilled = 0;

    // resetting timer and bonus tokens
    seconds = 0;

    // resetting tokens and intervals
    token0 = token1 = token2 = token3 = token4 = false

    interval0 = interval1 = interval2 = interval3 = interval4 = undefined;

    // resetting abilities
    ability1 = ability2 = ability3 = ability4 = false;

    // pass for the ability to be accessed only once
    pass1 = pass2 = pass3 = pass4 = true;

    // access to summon enemies after defeating boss
    access = true;

    // resetting time dependent functions
    timeInterval = runTime();

    // setting score to 0
    scoreDiv.innerHTML = 'Score: ' +gameScore;

}


// to spawm enemies continously with certain speed and timegap
function spawnEnemies(timegap, speed, posX, posY) {
    return setInterval(() => {

        // here we need to randomize with probabilities so we get more easy enemies than tough enemies

        // normal enemy
        if (Math.random() < 0.6) {
            ourEnemies.push(new Utils.Enemy(posX, posY, 60, {x: speed, y: 0}, 200, 'base'));

        }else {
            // healing enemy
            if (Math.random() < 0.6) {
                ourEnemies.push(new Utils.HealingEnemy(posX, posY, 60, {x:speed, y: 0}, 400, 'healing'));

            // doubling enemy
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

// pass to ensure the condition runs only once
let pass1, pass2, pass3, pass4;

// to ensure ability is ready and we can use them
let ability1, ability2, ability3, ability4;


// ABILTY FUNCTIONS GOES HERE

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
        let impactRadius = 250;

        if (player.status === 'rage') {
            impactRadius = 400;
        }
        areaDamages.push(new Utils.AreaDamage(player.posX + player.size/2, player.posY + player.size/2, impactRadius, 3));
        
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
function GenerateBombs() {
    if (ability3) {

        let size = 20;
        let speed = -7;
        if (player.status === 'rage') {
            size = 30;
            speed = -12
        }

        
        bombs.push(new Utils.GrenadeBomb(player.posX + player.size/2, player.posY + player.size/2, size, {x:0, y: speed}, 1000, 120));

        ability3 = false;

        setTimeout(() => {
            ability3 = true;
        }, 5000);
    }
}


// ability4
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

let MainInterval;

let access = true;


// function to add bonus to increase speed on increasing time
function levelUp() {
    // primary level
    if(seconds < 25 && !token0) {
        token0 = true;
        interval0 = spawnEnemies(1500, 3, 15, 50);
    }

    // medium level
    if (seconds > 25 && seconds < 50 && !token1) {
        bonusPoints += 100
        gameScore += 100;
        token1 = true;

        clearInterval(interval0)
        interval1 = spawnEnemies(1200, 4, 15, 50);
    }

    // hard level
    if (seconds > 50 && seconds < 75 && !token2) {
        bonusPoints += 150
        gameScore += 150;
        token2 = true;

        clearInterval(interval1);
        interval2 = spawnEnemies(1000, 4, 15, 50);
    }

    // expert level
    if (seconds > 75 && seconds < 100 && !token3) {
        bonusPoints += 300
        gameScore += 300;
        token3 = true

        clearInterval(interval2);
        interval3 = spawnEnemies(800, 5, 15, 50); 
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

        // to remove all enemy for the boss level
        setTimeout(() => {
            ourEnemies = [];
        }, 0)

        setTimeout(() => {
            let boss = new Utils.BossEnemy(25, 100, 256, {x: 0.5, y: 0}, 7000, 'boss');

            setInterval( () => {
                if (boss.hitpoints > 0 && boss.hitpoints <= 6000) {
                    boss.hitpoints += 1000;
                }
            }, 5000);

            ourEnemies.push(boss);
            access = true;
            
            MainInterval = setInterval(() => {

                let posX = boss.posX + boss.size/2;
                let posY = boss.posY + boss.size/2;

                ourEnemies.push(new Utils.DoublingEnemy(posX, posY, 60, {x: 3, y:0}, 600, 'doubling'));
                ourEnemies.push(new Utils.HealingEnemy(posX + 100, posY, 60, {x: 3, y:0}, 400, 'healing'));
            }, 3000)
            

            if (interval4 !== undefined) {
                clearInterval(interval4);
            }
        }, 500)
    }
}


// to handle enemies once we kill them
function enemyKill(enemy, index) {
    if (enemy.hitpoints <= 0) {

        if (enemy.type === 'doubling') {

            DoublingEnemyKilled++;

            gameScore += 40;
            setTimeout(() => {
                ourEnemies.splice(index, 1);
            }, 0);

            ourEnemies.push(new Utils.Enemy(enemy.posX - 70, enemy.posY, 60, enemy.velocity, 200, 'base'));
            ourEnemies.push(new Utils.Enemy(enemy.posX + 70, enemy.posY, 60, enemy.velocity, 200, 'base'));


        }
        
        else if (enemy.type === 'base') {

            enemiesKilled++;

            gameScore += 10
            setTimeout(() => {
                ourEnemies.splice(index, 1);
            }, 0);
        }

        else if (enemy.type === 'healing') {

            HealingEnemyKilled++;

            gameScore += 30;
            setTimeout(() => {
                ourEnemies.splice(index, 1);
            }, 0);
        }

        else if(enemy.type === 'boss') {
            BossEnemyKilled++;
            clearInterval(MainInterval);

            gameScore += 1500
            setTimeout(() => {
                ourEnemies.splice(index, 1);
                ourEnemies = [];
            }, 0);

            // only once token
            if (access) {
                interval4 = spawnEnemies(700, 6, 15, 50);
                access = false;
            }
            
        }
    }
}




// THIS IS MAIN FUNCTION WHICH RUNS FOR EVERY SINGLE FRAME
function update() {
   
    // to clear the screen for every frame
    Utils.clearScreen();

    // to handle animation
    gameOver = requestAnimationFrame(update);

    // to draw the player
    player.drawPlayer();

    // to move the player
    player.movePos();




    // to draw summon ships
    summons.forEach((summon, index) => {
        summon.draw();
    })



    // to display and function bomb
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



    // to display projectiles
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



    // to display explosion particles
    explosions.forEach((explosion, index) => {
        explosion.move();
    
        if (explosion.alpha < 0) {
            explosions.splice(index, 1);
        }
    })
    


    // to diplay and functioning of all enemies
    ourEnemies.forEach((enemy, index) => {
        enemy.move();


        // to detecting bullets
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


        // to detect bombs
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



        // for player and enemies collision and gameover
        let dist = Math.hypot(enemy.posX + enemy.size/2 - player.posX - player.size/2, enemy.posY + enemy.size/2 - player.posY -player.size/2);

        if((dist < (enemy.size + player.size)/2 && player.status === 'normal')
         || enemy.posY + enemy.size > canvasHeight) {
            
            // to stop animation
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

            enemiesKilledSpan.innerHTML = enemiesKilled;
            DoublingEnemyKilledSpan.innerHTML = DoublingEnemyKilled;
            HealingEnemyKilledSpan.innerHTML = HealingEnemyKilled;
            BossEnemyKilledSpan.innerHTML = BossEnemyKilled

            // clearing all intervals
            clearInterval(timeInterval);
            clearInterval(interval0);
            clearInterval(interval1);
            clearInterval(interval2);
            clearInterval(interval3);
            clearInterval(interval4);

            // adding sound
    
            Utils.makeSound(Utils.addSound('audios/391539__mativve__electro-win-sound.wav', 'win'));


            // to diplay scoreboard
            scoreBoard.style.display = 'flex';   
        }
    })


    // to show score
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


    // ability activations

    // ability1 -- to summon batleships
    if(e.key === 'b' || e.key === 'B') {
        summonShips();
    }

    // ability2 -- radial damage circle
    if (e.key === 'c' || e.key === 'C') {
        arealDestruction();
    }

    // ability3 -- destruction bomb
    if (e.key === ' ') {
        GenerateBombs();
    }

    // ability4 -- rage mode
    if (e.key === 'r' || e.key === 'R') {
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

    // for get the projection angle
    const angle = Math.atan2(e.clientY - player.posY - player.size/2 , e.clientX - player.posX - player.size/2);

    let speed = 15

    // x and y velocity of the projectile
    const velocity = {
        x: speed * Math.cos(angle),
        y: speed * Math.sin(angle)
    }

    let size = 6;
    let damage = 100;

    // changing stats if player is in rage mode
    if (player.status === 'rage') {
        size = 12;
        damage = 300;
        speed = 20;
    }

    // creating projectile
    projectiles.push(new Utils.Projectile(player.posX + player.size/2, player.posY + player.size/2, size, velocity, damage));


    // adding sound
    Utils.makeSound(Utils.addSound('audios/348163__djfroyd__laser-one-shot-2.wav', 'bullet'));
})


// EVENT LISTENER FOR START BTN
startGameBtn.addEventListener('click', () => {
    scoreBoard.style.display = 'none';

    // to reset all the values
    reset();

    // to start rendering the screen
    update();

})
