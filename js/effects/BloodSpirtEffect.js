/* global Phaser */
var BloodSpirtEffect = function(game, x, y, angle){
    
    this.game = game;
    
    Phaser.Sprite.call(this, this.game, x, y, 'bloodAnimation', 0);
    this.game.add.existing(this);    
    
    this.angle = angle - 180;
    
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.anchor.setTo(0.5);    
    this.body.setSize(48, 48);  
    this.pivot.x = -20;
    
    this.animations.add('run', null, 0, false); 
    
    this.animations.currentAnim.onComplete.add(function () {	
        this.animations.stop('run');
        this.destroy();
    }, this);
  
};

BloodSpirtEffect.prototype = Object.create(Phaser.Sprite.prototype);
BloodSpirtEffect.prototype.constructor = BloodSpirtEffect;

BloodSpirtEffect.prototype.update = function(){
    this.game.physics.arcade.velocityFromAngle(this.angle, 3000);
    this.game.add.tween(this).to({alpha: 0}, 80, Phaser.Easing.Linear.None, true);
    this.animations.play('run', 30);
};