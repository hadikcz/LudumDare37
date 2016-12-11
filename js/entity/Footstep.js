/* global Phaser */
var Footstep = function(game, x, y, angle, footstepFrame){
    
    this.game = game;
    
    Phaser.Sprite.call(this, this.game, x, y, 'footsteps', footstepFrame);
    this.game.add.existing(this);    
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.angle = angle - 270;
    
    this.anchor.setTo(0.5);
    this.scale.setTo(0.35);
    
    this.pivot.y = this.game.rnd.integerInRange(-20, 20);
    
    var secondFootstep = this.game.add.sprite(0, 0, 'footsteps', footstepFrame);
    secondFootstep.anchor.setTo(0.5);
    secondFootstep.pivot.x = -40;
    secondFootstep.pivot.y = this.game.rnd.integerInRange(-20, 20);

    this.addChild(secondFootstep);
    
    this.game.time.events.add(Phaser.Timer.SECOND * 5, function(){   
        var tween = this.game.add.tween(this).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true); 
        tween.onComplete.add(function(){
            this.destroy();
        }, this);
    }, this);
    
    onFloorThings.add(this);
};

Footstep.prototype = Object.create(Phaser.Sprite.prototype);
Footstep.prototype.constructor = Footstep;