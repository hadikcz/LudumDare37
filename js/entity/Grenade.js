/* global Phaser */
var Grenade = function(game, x, y, angle){
    
    this.game = game;
    
    Phaser.Sprite.call(this, this.game, x, y, 'grenade');
    this.game.add.existing(this);    
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(0.5);   
    
    this.body.collideWorldBounds = true;
    this.body.bounce.x = 0.2;
    this.body.bounce.y = 0.2;
    this.body.minBounceVelocity = 0;
    
    this.body.drag.set(100);
    
    this.angle = angle;
    
  
    this.game.time.events.add(Phaser.Timer.SECOND * 3, this.explosion, this);
    
    this.game.physics.arcade.accelerationFromRotation(this.rotation, 150, this.body.velocity);
    
    this.explosionSound = this.game.add.audio('explosionGrenade');
};

Grenade.prototype = Object.create(Phaser.Sprite.prototype);
Grenade.prototype.constructor = Grenade;


Grenade.prototype.update = function(){
    
};

Grenade.prototype.explosion = function(){
    zombieSpawner.zombies.forEach(function(zombie){
        var distance = this.game.physics.arcade.distanceBetween(this, zombie);
        if(distance < 100){
            zombie.hit(150);
        }
    }, this);
    
    for(var i = 0; i < 30; i++){
        var mass = new Mass(this.game, this.x, this.y);
        deployables.add(mass);
    }
    
    var explosion = new ExplosionEffect(this.game);
    explosion.launch(this.x, this.y);
    
    this.explosionSound.play();
    this.destroy();
};