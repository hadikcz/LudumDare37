var skipMenu = false;
var fpsGraph;
var isStarted = false;
var menuWindow;
var gameWorld, player, collisionHandler, zombies, zombieSpawner, gameInterface, onFloorThings, grenades, deployables;

function preload() {
    game.load.image('player', 'assets/player.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('deadZombie', 'assets/deadZombie.png');
    game.load.image('hpBg', 'assets/hpBg.png');
    game.load.image('hpBar', 'assets/hpBar.png');
    game.load.image('doorHpBar', 'assets/doorHpBar.png');
    game.load.image('doorHpBg', 'assets/doorHpBg.png');
    game.load.image('grenade', 'assets/grenade.png');
    game.load.image('lightMask', 'assets/lightMask.png');
    game.load.image('medkit', 'assets/medkit.png');
    game.load.image('turretPickup', 'assets/turretPickup.png');
    game.load.image('mass', 'assets/mass.png');
    game.load.image('bg', 'assets/bg.jpg');
    
    game.load.tilemap('map', 'map/map2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/tileset2.png', 32, 32);
    game.load.spritesheet('playerAnimation', 'assets/playerAnimation.png', 64, 64);
    game.load.spritesheet('zombieAnimation', 'assets/zombieAnimation.png', 64, 64);
    game.load.spritesheet('weaponFireAnimation', 'assets/weaponFireAnimation.png', 147, 115);
    game.load.spritesheet('bloodAnimation', 'assets/bloodAnimation.png', 64, 64);
    game.load.spritesheet('blood', 'assets/blood.png', 64, 64);
    game.load.spritesheet('footsteps', 'assets/footsteps.png', 64, 64);
    game.load.spritesheet('turret', 'assets/turret.png', 64, 64);
    
    game.load.audio('gunshoot', 'assets/sounds/gunshoot2.wav');
    game.load.audio('zombiePunch', 'assets/sounds/zombiePunch.wav');
    game.load.audio('ouch', 'assets/sounds/ouch.wav');
    game.load.audio('playerDie', 'assets/sounds/playerDie.wav');
    game.load.audio('zombieHit', 'assets/sounds/zombieHit.wav');
    game.load.audio('zombieDead', 'assets/sounds/zombieDead.wav');
    game.load.audio('zombieDead2', 'assets/sounds/zombieDead2.wav');
    game.load.audio('doorDestroy', 'assets/sounds/doorDestroy.wav');
    game.load.audio('explosionGrenade', 'assets/sounds/explosionGrenade.wav');
    game.load.audio('pickupMedkit', 'assets/sounds/pickupMedkit.wav');
    game.load.audio('turretSound', 'assets/sounds/turretSound.wav');
}


function create() { 
    startup();
    
    if(skipMenu === true){
        isStarted = true;
        startGame();
    } else {
        menuWindow = new MenuWindow(game);
    }
}

function startGame(){
    if(typeof menuWindow !== 'undefined'){
        menuWindow.destroy();
    }
    
    gameWorld = new GameWorld(game);
    onFloorThings = game.add.group();
    
    player = new Player(game, gameWorld);
    zombies = game.add.group();
    grenades = game.add.group();
    deployables = game.add.group();
    
    zombieSpawner = new ZombieSpawner(game, gameWorld, zombies);
    
    collisionHandler = new CollisionHandler(game, player, player.weapon.bullets, zombies, gameWorld);
    gameInterface = new GameInterface(game);
    
    this.game.time.events.add(500, function(){collisionHandler.canToxicHit = true;}, this);
}


function update() {
    if(isStarted === false){
        menuWindow.update();
    } else {
        gameWorld.update();
        collisionHandler.update();
        zombieSpawner.update();
    }
}

function render() {
//	game.debug.text("FPS: " + game.time.fps, 5, 10);
//    player.weapon.debug();
//    game.debug.body(player);
//    zombies.forEach(function(zombie){
//        game.debug.body(zombie);
//    });
//    deployables.forEach(function(zombie){
//            game.debug.body(zombie.barrell);
////        game.debug.body(zombie);
//        if(typeof zombie.barrell !== 'undefined'){
//            game.debug.body(zombie.barrell);
//        }
//    });
}

function startup(){
    game.stage.disableVisibilityChange = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.time.advancedTiming = true;
}