/* global Phaser */
var Turret = function(game, x, y){
    
    this.game = game;
    
    Phaser.Sprite.call(this, this.game, x, y, 'turret', 0);
    this.game.add.existing(this);    
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(0.5);   
        
    this.angle = this.game.rnd.integerInRange(-180, 180);
    this.immovable = true;
    this.body.moves = false;
    
    this.barrell = this.game.add.sprite(this.x, this.y, 'turret', 1);
    this.barrell.anchor.setTo(0.5);
    this.barrell.pivot.x = -15;
    
    
    this.game.physics.enable(this.barrell, Phaser.Physics.ARCADE);
    
    this.weapon = this.createWeapon();
    
    this.target = {};
    
    this.ammo = 1000;
    this.ammoText = this.game.add.text(this.x, this.y - 50, 'Ammo ' + this.ammo, {fill: 'white', font: '12px Arial'});
    this.ammoText.anchor.setTo(0.5);
    this.ammoText.stroke = "#000000";
    this.ammoText.strokeThickness = 2;
        
    
    deployables.add(this);
    
    this.fireAnimation = this.game.add.sprite(0, 0, 'weaponFireAnimation', 0);
    this.fireAnimation.anchor.setTo(0.5);
    this.fireAnimation.pivot.x = -130;
    this.fireAnimation.pivot.y = -5;
    this.fireAnimation.scale.setTo(0.3);
    this.fireAnimation.visible = false;
    this.barrell.addChild(this.fireAnimation);
    
    
    this.shootSound = game.add.audio('turretSound', 0.5);
};

Turret.prototype = Object.create(Phaser.Sprite.prototype);
Turret.prototype.constructor = Turret;


Turret.prototype.update = function(){
    if(typeof this.target.hp === 'undefined'){
        this.target = this.foundTarget();
    } else {
        if(this.target.hp <= 0){
            this.target = {};
        }
        var distance = this.game.physics.arcade.distanceBetween(this, this.target);
        if(distance <= 200){
            var rotation = this.game.physics.arcade.angleBetween(this, this.target);
            var rotationDifference = Math.abs(this.rotation - rotation);
            if(rotationDifference < 4){
                this.game.add.tween(this.barrell).to({rotation: rotation}, 300, Phaser.Easing.Linear.None, true);
            } else {
                this.rotation = rotation;
            }
            
            if(this.ammo > 0){
                var isShoot = this.weapon.fire();
            }
            if(isShoot){
                this.shootSound.play();
                this.ammo--;
                this.ammoText.setText('Ammo ' + this.ammo);
                this.fireAnimation.visible = true;
                this.fireAnimation.animations.play('fire', 60);  
                this.game.time.events.add(150, function(){
                    this.fireAnimation.visible = false;
                    this.fireAnimation.animations.stop(); 
                }, this);
            }
        }
    }
    
    if(this.ammo <= 0){
        var tween = this.game.add.tween(this).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true); 
        this.game.add.tween(this.barrell).to({alpha: 0}, 600, Phaser.Easing.Linear.None, true); 
        tween.onComplete.add(function(){
            this.barrell.destroy();
            this.destroy();
            this.ammoText.destroy();
        }, this);
    }
    
    // collisons
    this.game.physics.arcade.overlap(this.weapon.bullets, zombies, function(bullet, zombie){
        zombie.hit(this.game.rnd.integerInRange(20, 25));
        bullet.kill();
    }, null, this);
    
    
    this.game.physics.arcade.overlap(this.weapon.bullets, gameWorld.tilemap.layer[3], function(bullet, layer){
        if(typeof layer.properties.solid !== 'undefined' && typeof layer.properties.shootable == 'undefined'){
            bullet.kill();
        }
    }, null, this);
};

Turret.prototype.foundTarget = function(){
    var nearestDistance = 99999;
    var nereastZombie = {};
    
    zombies.forEach(function(zombie){
        var distance = this.game.physics.arcade.distanceBetween(this, zombie);
        if(distance < nearestDistance){
            nearestDistance = distance;
            nereastZombie = zombie;
        }
    }, this);
    
    return nereastZombie;
};

Turret.prototype.createWeapon = function(){
    var weapon = this.game.add.weapon(30, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN ;
    weapon.bulletSpeed = 700;
    weapon.bulletAngleVariance = 5;
    weapon.trackSprite(this.barrell, 25, 0, true);
    weapon.bulletAngleOffset = 180;
    weapon.fireRate = 200; // 300
    weapon.bulletLifespan = Phaser.Timer.SECOND * 1;
    weapon.multiFire = true;
    weapon.bulletCollideWorldBounds = true;
    return weapon;
};

Turret.prototype.pick = function(){
    
};