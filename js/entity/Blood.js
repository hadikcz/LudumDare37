/* global Phaser */
var Blood = function(game, x, y){
    
    this.game = game;
    
    Phaser.Sprite.call(this, this.game, x, y, 'blood', this.game.rnd.integerInRange(0, 5));
    this.game.add.existing(this);    
    
    this.angle = this.game.rnd.integerInRange(-180, 180);
    
    this.anchor.setTo(0.5);    
   
    var disaperTime = Phaser.Timer.SECOND * this.game.rnd.integerInRange(5, 15);
    
    this.game.time.events.add(disaperTime, function(){   
        var tween = this.game.add.tween(this).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true); 
        tween.onComplete.add(function(){
            this.destroy();
        }, this);
    }, this);
    
    onFloorThings.add(this);
  
};

Blood.prototype = Object.create(Phaser.Sprite.prototype);
Blood.prototype.constructor = Blood;