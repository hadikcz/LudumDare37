/* global Phaser */
var Player = function(game, gameWorld){
    
    this.game = game;
    
    this.gameWorld = gameWorld;
    
    Phaser.Sprite.call(this, this.game, this.gameWorld.playerSpawn.x, this.gameWorld.playerSpawn.y, 'playerAnimation', 2);
    this.game.add.existing(this);    
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.anchor.setTo(0.5);    
    this.body.setSize(32, 32, 16, 16);  
    this.body.collideWorldBoudns = true;    
    this.game.camera.follow(this);
    
    this.fireAnimation = this.game.add.sprite(0, 0, 'weaponFireAnimation', 0);
    this.fireAnimation.anchor.setTo(0.5);
    this.fireAnimation.pivot.x = -240;
    this.fireAnimation.pivot.y = -30;
    this.fireAnimation.scale.setTo(0.2);
    this.addChild(this.fireAnimation);
    
    this.animations.add('walk', null, 10, true);
    this.fireAnimation.animations.add('fire', null, 10, false);
    
    this.weapon = this.createWeapon();
    
    this.weaponGrenades = 2;
    this.isGrenadeReady = true;
    
    this.turrets = 0;
    this.isTurretDeployReady = true;
    
    this.maxHp = 100;
    this.hp = 100;
    
    
    this.shootSound = game.add.audio('gunshoot', 0.5);
    this.ouchSound = game.add.audio('ouch');
    this.playerDie = game.add.audio('playerDie');
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
    this.handleControlls();
};

Player.prototype.handleControlls = function(){
    this.rotation = (this.game.physics.arcade.angleToPointer(this) + Math.PI / (1/2)) ;
    
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.W))
        this.body.velocity.y = -150;
    
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.S))
        this.body.velocity.y = 150;
    
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.A))
        this.body.velocity.x = -150;
    
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.D))
        this.body.velocity.x = 150;
    
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        if(this.weaponGrenades > 0 && this.isGrenadeReady){
            this.throwGrenade();
        }
    }
    
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.Q)){
        if(this.turrets > 0 && this.isTurretDeployReady){
            this.placeTurret();
        }
    }
    
    if(this.body.velocity.x !== 0 || this.body.velocity.y !== 0){
        this.animations.play('walk', 20);
    } else {
        this.animations.stop('walk');
    }
    
    if(this.game.input.activePointer.leftButton.isDown){
        var fire = this.weapon.fire();
        
        if(fire){
            this.fireAnimation.visible = true;
            this.fireAnimation.animations.play('fire', 60);  
            this.shootSound.play();
        } else {
            this.fireAnimation.animations.stop('fire');
            this.fireAnimation.visible = false;
        }
    } else {
        this.fireAnimation.animations.stop('fire');
        this.fireAnimation.visible = false;
        
    }
};

Player.prototype.createWeapon = function(){
    var weapon = this.game.add.weapon(30, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN ;
    weapon.bulletSpeed = 400;
    weapon.bulletAngleVariance = 5;
    weapon.trackSprite(this, 25, 6, true);
    weapon.bulletAngleOffset = 180;
    weapon.fireRate = 300; // 300
    weapon.bulletLifespan = Phaser.Timer.SECOND * 1;
    weapon.multiFire = true;
    weapon.bulletCollideWorldBounds = true;
    return weapon;
};

Player.prototype.hit = function(damage){
    this.hp -= damage;
    gameInterface.redScreenEffect();
    
    if(this.hp <= 30){
        this.ouchSound.play();
    }
    
    if(this.hp <= 0){
        this.playerDie.play();
        this.gameWorld.restart();
    }
    
    var percentage = Math.round(100 * (this.hp / this.maxHp));
    gameInterface.healtBar.setPercent(percentage);
};

Player.prototype.restart = function(){
    // Require lataceny, because it depence on kill all zombies, cant destroy entaire group, PHASER bug ? ZombieSpawner.restart
    this.game.time.events.add(100, function(){  
         player.hp = player.maxHp;
        gameInterface.healtBar.setPercent(100);
        
    }, this);
};

Player.prototype.heal = function(heal){
    this.hp += heal;
    if(this.hp > this.maxHp){
        this.hp = this.maxHp;
    }
    var percentage = Math.round(100 * (this.hp / this.maxHp));
    gameInterface.healtBar.setPercent(percentage);
};

Player.prototype.throwGrenade = function(){
    var grenade = new Grenade(this.game, this.x, this.y, this.angle);
    grenades.add(grenade);

    this.isGrenadeReady = false;
    this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){this.isGrenadeReady = true;}, this);
    
    this.weaponGrenades--;
    gameInterface.grenadeCount.setText(this.weaponGrenades);
};

Player.prototype.placeTurret = function(){
    new Turret(this.game, this.x, this.y);

    this.isTurretDeployReady = false;
    this.game.time.events.add(Phaser.Timer.SECOND * 1, function(){this.isTurretDeployReady = true;}, this);
    
    this.turrets--;
    gameInterface.turretCount.setText(this.turrets);
};