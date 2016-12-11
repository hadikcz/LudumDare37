/* global Phaser */
var Mass = function(game, x, y){
    
    this.game = game;
    
    Phaser.Sprite.call(this, this.game, x, y, 'mass');
    this.game.add.existing(this);    
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(0.5);   
    
    this.body.collideWorldBounds = true;
    this.body.bounce.x = 0;
    this.body.bounce.y = 0;
    this.body.minBounceVelocity = 0;
    this.body.mass = 5;
    
    this.scale.setTo(1);
    
    this.body.drag.set(100);
    
    this.angle = this.game.rnd.integerInRange(-180, 180);
    
    this.game.physics.arcade.accelerationFromRotation(this.rotation, 800, this.body.velocity);
    
    this.game.time.events.add(150, this.disaper, this);
    this.alpha = 0;
};

Mass.prototype = Object.create(Phaser.Sprite.prototype);
Mass.prototype.constructor = Mass;


Mass.prototype.disaper = function(){
    try{
        var tween = this.game.add.tween(this).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true); 
        tween.onComplete.add(function(){
            this.destroy();
        }, this);
    }catch(e){};
};

Mass.prototype.pick = function(){
};