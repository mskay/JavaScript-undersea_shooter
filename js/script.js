


var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'container', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('space', 'assets/deep-space.jpg');
    game.load.image('bullet', 'assets/bullets.png');
    game.load.image('submarine', 'assets/submarine.png');
    game.load.image('enemy', 'assets/octopus.png');
    game.load.image('octopus', 'assets/octopus_small.png');
    //game.load.atlasXML('octopus', 'assets/octopus.png', 'assets/octopus.xml');
    game.load.image('undersea', 'assets/undersea.jpg');

    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

var sprite = null;
var cursors;

var enemyNum = 1;
var player;
var score = 0;
var bullet;
var bullets;
var bulletTime = 0;

var octopus;

var alive = true;

function create() {

    

    //  This will run in Canvas mode, so let's gain a little speed and display
    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    //  We need arcade physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A spacey background
    game.add.tileSprite(0, 0, game.width, game.height, 'undersea');


    octopus = game.add.group();
    octopus.enableBody = true;
    octopus.physicsBodyType = Phaser.Physics.ARCADE;

    var frameNames = Phaser.Animation.generateFrameNames('octopus', 0, 24, '', 4);

    octopus.callAll('animations.add', 'animations', 'swim', frameNames, 30, true, false);

    // 'play the swim animation', this time the 'play' method exists on the child itself, so we can set the context to null.
    octopus.callAll('play', null, 'swim');

    //  Our ships bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    //  All 40 of them
    bullets.createMultiple(40, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);

    //  Our player ship
    sprite = game.add.sprite(300, 300, 'submarine');
    sprite.anchor.set(0.5);
    sprite.scale.setTo(0.1,0.1);

    //  and its physics settings
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    sprite.body.drag.set(100);
    sprite.body.maxVelocity.set(200);

    //  Game input
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    //  The score
    scoreText = game.add.text(10, 10, 'score: 0', { fontSize: '40px', fill: '#fff' });

}

function update() {

      if (alive == true) {
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        fireButton.onDown.add(fireBullet, this);
        // Creates enemies
        while (octopus.countLiving() < enemyNum) {
            //octopus.create(game.world.randomX, game.world.randomY, 'octopus')
            createOctopus();
        }

        if (cursors.up.isDown)
        {
            game.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
        
        }
        else
        {
            sprite.body.acceleration.set(0);
        }

        // moves backwards slower
        if (cursors.down.isDown) {
            game.physics.arcade.accelerationFromRotation(sprite.rotation, -100, sprite.body.acceleration);

            
        }
        if (cursors.left.isDown)
        {
            sprite.body.angularVelocity = -300;
        }
        else if (cursors.right.isDown)
        {
            sprite.body.angularVelocity = 300;
        }
        else
        {
            sprite.body.angularVelocity = 0;

        }
        
        

       

        /* This section causes the octopus to chase the player */
        if (enemyNum < 5) {
            //or accelerateToObject
            octopus.forEach( function(enemie) {
                this.moveToObject(enemie, sprite, 50);
            }, game.physics.arcade);
        } else if ((enemyNum > 5 && enemyNum < 10)) {
            octopus.forEach( function(enemie) {
                this.moveToObject(enemie, sprite, 40);
            }, game.physics.arcade);

            sprite.body.drag.set(10);
        sprite.body.maxVelocity.set(400);

        } else if ((enemyNum > 10 && enemyNum < 20)) {
            octopus.forEach( function(enemie) {
                this.moveToObject(enemie, sprite, 30);
            }, game.physics.arcade);
        }
  

        // calls the kill methods when the emenies, players, and bullets collide
        game.physics.arcade.collide(bullets, octopus, killEnemy);
        game.physics.arcade.collide(sprite, octopus, killPlayer, null, this);
        screenWrap(sprite);

        //bullets.forEachExists(screenWrap, this);
    }
   
}

function fireBullet () {
    // cant fire if the sprite is dead
    if (alive == true) {
        if (game.time.now > bulletTime)
        {
            bullet = bullets.getFirstExists(false);

            if (bullet)
            {
                // controls where bullet is fired from
                bullet.reset(sprite.body.x + 50, sprite.body.y + 52);
                bullet.lifespan = 1800;
                bullet.rotation = sprite.rotation;
                game.physics.arcade.velocityFromRotation(sprite.rotation, 400, bullet.body.velocity);
                bulletTime = game.time.now + 50;
            }
        }
    }
}

function screenWrap (sprite) {

    if (sprite.x < 0)
    {
        sprite.x = game.width;
    }
    else if (sprite.x > game.width)
    {
        sprite.x = 0;
    }

    if (sprite.y < 0)
    {
        sprite.y = game.height;
    }
    else if (sprite.y > game.height)
    {
        sprite.y = 0;
    }

}

// Randomly places enemy on outside walls so that it doesnt spawn too close to player
function createOctopus(){
    var randomSpawn = Math.floor(Math.random()*4);
    switch(randomSpawn){
        case 0:
        octopus.create(0, game.world.randomY, 'octopus');
        break;
        case 1:
        octopus.create(game.world.randomX, 0, 'octopus');
        break;
        case 2:
        octopus.create(game.world.randomX, 600, 'octopus');
        break;
        case 3:
        octopus.create(800, game.world.randomY, 'octopus');
        break;
        default:
        console.log("error");
    }
}

function killEnemy (bullet, enemy) {
    
    // Removes the star from the screen
    bullet.kill();
        
    enemy.destroy();
    
    //  Add and update the score
    enemyNum++;
    score += 1;
    scoreText.text = 'Score: ' + score;
    
}

function killPlayer(player) {
    player.kill();
    scoreText.text = 'GAME OVER   Score: ' + score;
    alive = false;
}

function render() {
}
