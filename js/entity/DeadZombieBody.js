/* global Phaser */
var DeadZombieBody = function(game, x, y){
    
    this.game = game;
    
    Phaser.Sprite.call(this, this.game, x, y, 'deadZombie');
    this.game.add.existing(this);    
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.angle = this.game.rnd.integerInRange(-180, 180);
    
    this.anchor.setTo(0.5);
    this.scale.setTo(0.65);
    
    var disaperTime = Phaser.Timer.SECOND * this.game.rnd.integerInRange(5, 15);
    
    this.game.time.events.add(disaperTime, function(){   
        var tween = this.game.add.tween(this).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true); 
        tween.onComplete.add(function(){
            this.destroy();
        }, this);
    }, this);
    
    onFloorThings.add(this);
};

DeadZombieBody.prototype = Object.create(Phaser.Sprite.prototype);
DeadZombieBody.prototype.constructor = DeadZombieBody;