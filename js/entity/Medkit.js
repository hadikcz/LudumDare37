/* global Phaser */
var Medkit = function(game, x, y){
    
    this.game = game;
    
    this.type = 'medkit';
    
    Phaser.Sprite.call(this, this.game, x, y, 'medkit');
    this.game.add.existing(this);    
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(0.5);   
    
    this.body.collideWorldBounds = true;
    this.body.bounce.x = 0.2;
    this.body.bounce.y = 0.2;
    this.body.minBounceVelocity = 0;
    
    this.scale.setTo(0.5);
    
    this.body.drag.set(100);
    
    this.angle = this.game.rnd.integerInRange(-180, 180);
    
    this.game.physics.arcade.accelerationFromRotation(this.rotation, 150, this.body.velocity);
    
    this.game.time.events.add(Phaser.Timer.SECOND * 15, this.disaper, this);
    
    this.pickupSound = game.add.audio('pickupMedkit');
};

Medkit.prototype = Object.create(Phaser.Sprite.prototype);
Medkit.prototype.constructor = Medkit;


Medkit.prototype.disaper = function(){
    try{
        var tween = this.game.add.tween(this).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true); 
        tween.onComplete.add(function(){
            this.destroy();
        }, this);
    }catch(e){};
};

Medkit.prototype.pick = function(){
    if(player.hp !== player.maxHp){
        player.heal(100);
        this.pickupSound.play();
        this.destroy();
    }
};