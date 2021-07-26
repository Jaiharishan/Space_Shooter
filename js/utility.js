// UTILITY FILE FOR CLASSES AND FUNCTIONS
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

// summonShip
const battleShip = document.querySelector('#battleship');

// alien-ENEMY
const alien = document.querySelector('#alien');

// doubling-alien
const doublingAlien = document.querySelector('#doublingAlien');

// shooting Alien
const shootingAlien = document.querySelector('#shootingAlien');

// boss Alien
const bossAlien = document.querySelector('#bossAlien');

// hut 
const spawnHut = document.querySelector('#hut');


// to slow down the speed of explosion
const friction = 0.99


// ALL CLASSES


// PLAYER CLASS
class Player {
    constructor(posX, posY, size, speed, dx ,dy, status) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.speed = speed;
        this.dx = dx;
        this.dy = dy;
        this.status = status;
    }

    drawPlayer() {
        ctx.drawImage(spaceship, this.posX, this.posY, this.size, this.size);
    }

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

    movePos() {
        this.posX += this.dx;
        this.posY += this.dy;

        this.detectCollision();
    }
}



class BattleShip {
    constructor(posX, posY, size) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
    }

    draw() {
        ctx.drawImage(battleship, this.posX, this.posY, this.size, this.size);

        if (this.posX + this.size> canvasWidth) {
            this.posX = canvasWidth - 20 - this.size;
        }
        if (this.posX - this.size < 0) {
            this.posX = 20 + this.size;
        }

        if (this.posY + this.size > canvasHeight) {
            this.posY = canvasHeight - 20 - this.size;
        }

        if (this.posY - this.size < 0) {
            this.posY = 20 + this.size;
        }

    }


    shoot() {
        return new Projectile(this.posX + this.size/2, this.posY + this.size/2, 6, {x: 0, y: -15}, 100);
        
    }
}



class AreaDamage {
    constructor(posX, posY, radius, damage) {
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.damage = damage;
        this.alpha = 0.2;

    }

    draw(playerX, playerY) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = 'rgb(255, 123, 0)';
        ctx.beginPath();
        ctx.arc(playerX, playerY, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();

        this.damage *= 1.001;
    }


}



class GrenadeBomb {
    constructor(posX, posY, size, velocity, damage, impactRadius) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.velocity = velocity;
        this.damage = damage;
        this.impactRadius = impactRadius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.size, 0, Math.PI * 2, true);
        ctx.fillStyle = 'rgb(255, 72, 0)';
        ctx.fill();
    }

    move() {
        this.draw();
        this.posX = this.posX +  this.velocity.x;
        this.posY = this.posY + this.velocity.y;
    }
}



// FOR BULLETS CLASS
class Projectile {
    constructor(posX, posY, size, velocity, damage) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.velocity = velocity;
        this.damage = damage;
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



// CLASS FOR EXPLODING PARTICLE
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



// CLASS FOR ALL ENEMIES
class Enemy {
    constructor(posX, posY, size, velocity, hitpoints, type) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.velocity = velocity;
        this.hitpoints = hitpoints;
        this.type = type;
    }

    draw() {       
        ctx.drawImage(alien, this.posX, this.posY, this.size, this.size);
        this.healthBar();
        
    }


    healthBar() {
        let totalHitpoints
        if (this.type === 'base') {
            totalHitpoints = 200;
        }
        else if (this.type === 'doubling') {
            totalHitpoints = 600;
        }
        else if (this.type === 'healing') {
            totalHitpoints = 400;
        }
        else if (this.type === 'boss') {
            totalHitpoints = 7000;
        }

        let health = (this.hitpoints/totalHitpoints) * this.size;

        
        
        if (this.hitpoints >= 0) {
            // green bar
            ctx.fillStyle = 'rgb(0, 200, 0)';
            ctx.fillRect(this.posX, this.posY - 12, health , 8);

            // red bar
            ctx.fillStyle = 'rgb(200, 0, 0)';
            ctx.fillRect(this.posX + health, this.posY - 12, this.size - health, 8);

        }else {
            // only red bar
            ctx.fillStyle = 'rgb(200, 0, 0)';
            ctx.fillRect(this.posX, this.posY - 12, this.size, 8);

        }
        
        ctx.strokeStyle = 'rgb(12, 12, 12)';
        ctx.strokeRect(this.posX, this.posY - 12, this.size, 8);
    }

    move() {
        this.draw();
        this.posX = this.posX +  this.velocity.x;
        this.posY = this.posY + this.velocity.y;

        if (this.posX < 0) {
            this.posY += this.size + 15;
            this.velocity.x *= -1;
        }

        if(this.posX + this.size > canvasWidth) {
            this.posY += this.size + 15;
            this.velocity.x *= -1;
        }
    }
}


// CLASS FOR DOUBLING ENEMY
class DoublingEnemy extends Enemy {

    draw() {
        ctx.drawImage(doublingAlien, this.posX, this.posY, this.size, this.size);
        this.healthBar();
    }
}


// CLASS FOR HEALING ENEMY
class HealingEnemy extends Enemy {
    draw() {
        ctx.drawImage(shootingAlien, this.posX, this.posY, this.size, this.size);
        this.healthBar();
    }

    shoot() {
        if (this.hitpoints > 0) {
            return new Projectile(this.posX, this.posY, 6, {x: 0, y: 5}, 100);
        }
        
    }
}


// FOR THE BOSS ENEMY
class BossEnemy extends Enemy {
    draw() {       
        ctx.drawImage(bossAlien, this.posX, this.posY, this.size, this.size);
        this.healthBar();
        
    }
}

// FOR THE SPAWN HUT
class Hut {
    constructor(posX, posY, size, duration, spawnSpeed) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.duration = duration;
        this.spawnSpeed = this.spawnSpeed;
    }

    draw() {
        ctx.drawImage(spawnHut, this.posX, this.posY, this.size, this.size);
    }
}


// FUNCTIONS


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



// exporting all classes and function
export {Player, BattleShip, AreaDamage, GrenadeBomb,  Projectile, Explosion, Enemy, DoublingEnemy, HealingEnemy as HealingEnemy, BossEnemy, Hut, addSound, makeSound, clearScreen};