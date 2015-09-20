
/*
// Game Variables
var fireButton;
var x = 1;
var height = 400;
var width = 400;
var gameStart = false;
var score = 0;
var scoreText;
var playerHealth = 5;
var playerHealthText;

var game = new Phaser.Game(height, width, Phaser.AUTO, '', { preload: preload, create: create, update: update });
function preload() {
    game.load.image('blue', 'assets/ship.png');
    game.load.image('red', 'assets/dude.png');
    game.load.image('blueBullet', 'assets/bullets.png')
    game.load.image('redBullet', 'assets/dude.png')
}

function create() {
    player = game.add.sprite(height/2, width/2, 'blue');
    cursors = game.input.keyboard.createCursorKeys();
    gameStart = true;

    //  This will force it to decelerate and limit its speed
    player.body.collideWorldBounds = true;

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton.onDown.add(fireBullet, this);

    // Our enemy group
    enemies = game.add.group();

    //  Our bullet group
    bullets = game.add.group();
    bullets.createMultiple(30, 'blueBullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);

    player.anchor.setTo(0.5, 0.5);
    scoreText = game.add.text(16, 16, 'score: 0', { font: '32px arial', fill: '#fff' });
    playerHealthText = game.add.text(16, 350, 'Health: 5', { font: '32px arial', fill: '#fff' });
    
}

function update() { 
    // Rotates Player on Left / Right keys 

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    player.body.angularVelocity = 0;

    //player.rotation = player.body.angularVelocity;

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        player.body.angularVelocity = -200;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        player.body.angularVelocity = 200;
    }
    // Keybinding (Up)
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.W))
    {
        game.physics.velocityFromAngle(player.angle, 50, player.body.velocity);
    }
    // Keybinding (Down)
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
        game.physics.velocityFromAngle(player.angle, -20, player.body.velocity);
    }

    //enemy movement
    while(enemies.countLiving() < x)
    {
        createEnemy();
    }


   game.physics.collide(bullets, enemies, bulletHitEnemy, null, this);
   game.physics.collide(enemies, player, enemyHitPlayer, null, this);

    if (gameStart === true)
    {
        //  First is the callback
        //  Second is the context in which the callback runs, in this case game.physics
        //  Third is the parameter the callback expects - it is always sent the Group child as the first parameter
        //enemies.forEach(game.physics.moveToPointer, game.physics, false, 100);
        enemies.forEach(
            function(singleEnemy) {
                this.moveToObject(singleEnemy, player, 20);
            }, game.physics);

        // Sweet orbiting thing
       /** enemies.forEach(function(enemie) 
            {
                this.accelerateToObject(enemie, player, 600, 250, 250);
            }, game.physics);**/
/*
    }
    else
    {
        enemies.setAll('body.velocity.x', 0);
        enemies.setAll('body.velocity.y', 0);
    }

    if (playerHealth === 0){
        endGame();
    }


}

// Randomly places enemy on outside walls
function createEnemy(){
    var randomSpawn = Math.floor(Math.random()*4);
    switch(randomSpawn){
        case 0:
        enemies.create(0, game.world.randomY, 'red');
        break;
        case 1:
        enemies.create(game.world.randomX, 0, 'red');
        break;
        case 2:
        enemies.create(game.world.randomX, height, 'red');
        break;
        case 3:
        enemies.create(width, game.world.randomY, 'red');
        break;
        default:
        console.log("error");
    }
}

function enemyChase(){
    if(this.enemies.x < player.x){
        this.enemies.x
    }
}

function fireBullet () {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y);
           // bullet.rotation = game.physics.moveToPointer(bullet, 300);
            game.physics.velocityFromAngle(player.angle, 400, bullet.body.velocity);
        }
}
function bulletHitEnemy (blueBullet, redbox) {

    blueBullet.kill();
    redbox.kill();
    x++;//When enemy is killed, +1 added to X - which causes 2 to spawn whenever an enemy is killed.
    score += 1;
    scoreText.content = 'Score: ' + score;
}

function enemyHitPlayer (player, redbox) {
   playerHealth -= 1;
   playerHealthText.content = 'Health: ' + playerHealth;
   redbox.kill();
   if (playerHealth === 0){
        player.kill();
   }
}

function endGame (player, redbox) {
    var text = "You have been swarmed\n refresh browser to restart";
    var style = { font: "30px Arial", fill: "#ff0044", align: "center" };
    var t = game.add.text(game.world.centerX-180, 250, text, style);
    playerHealth-=1;
}
*/



var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'container', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('space', 'assets/deep-space.jpg');
    game.load.image('bullet', 'assets/bullets.png');
    game.load.image('submarine', 'assets/submarine.png');
    game.load.image('enemy', 'assets/octopus.png');
    game.load.atlasXML('octopus', 'assets/octopus.png', 'assets/octopus.xml');
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

    //  Here we just say 'play the swim animation', this time the 'play' method exists on the child itself, so we can set the context to null.
    octopus.callAll('play', null, 'swim');

    var octopi = game.add.sprite(300, 200, 'octopus');

    //  Create an animation called 'swim', the fact we don't specify any frames means it will use all frames in the atlas
    octopi.animations.add('swim');

    //  Play the animation at 30fps on a loop
    octopi.animations.play('swim', 30, true);

    //  Create an animation called 'swim', the fact we don't specify any frames means it will use all frames in the atlas
    //octopus.animations.add('swim');

    //  Play the animation at 30fps on a loop
    //octopus.animations.play('swim', 30, true);

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
    sprite.scale.setTo(0.2,0.2);

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
        // Creates enemies
        while (octopus.countLiving() < enemyNum) {
            octopus.create(game.world.randomX, game.world.randomY, 'octopus')
            


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

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            fireBullet();
        }



        //or accelerateToObject
        octopus.forEach( function(enemie) {
            this.moveToObject(enemie, sprite, 50);
        }, game.physics.arcade);

  

        // calls the kill methods when the emenies, players, and bullets collide
        game.physics.arcade.collide(bullets, octopus, killEnemy);
        //game.physics.arcade.collide(sprite, octopus, killPlayer, null, this);
        screenWrap(sprite);

        bullets.forEachExists(screenWrap, this);
    }
   
}

function fireBullet () {

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
