/* global Phaser */
var TurretPickup = function(game, x, y){
    
    this.game = game;
    
    Phaser.Sprite.call(this, this.game, x, y, 'turretPickup');
    this.game.add.existing(this);    
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(0.5);   
    
    this.body.collideWorldBounds = true;
    this.body.bounce.x = 0.2;
    this.body.bounce.y = 0.2;
    this.body.minBounceVelocity = 0;
    
    this.scale.setTo(1);
    
    this.body.drag.set(100);
    
    this.angle = this.game.rnd.integerInRange(-180, 180);
    
    this.game.physics.arcade.accelerationFromRotation(this.rotation, 150, this.body.velocity);
    
    this.game.time.events.add(Phaser.Timer.SECOND * 15, this.disaper, this);
    
    this.pickupSound = game.add.audio('pickupMedkit');
};

TurretPickup.prototype = Object.create(Phaser.Sprite.prototype);
TurretPickup.prototype.constructor = TurretPickup;


TurretPickup.prototype.disaper = function(){
    try{
        var tween = this.game.add.tween(this).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true); 
        tween.onComplete.add(function(){
            this.destroy();
        }, this);
    }catch(e){};
};

TurretPickup.prototype.pick = function(){
    player.turrets++;
    gameInterface.turretCount.setText(player.turrets);
    this.pickupSound.play();
    this.destroy();
};