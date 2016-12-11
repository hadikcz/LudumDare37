ExplosionEffect = function (game) {
    this.game = game;
    
    var size = 24 ;

    var bmd = this.game.add.bitmapData(size * 2, size * 2);
    bmd.circle(size, size, size, '#FFFFFF');
    
    Phaser.Sprite.call(this, this.game, 0, 0, bmd);
    this.game.add.existing(this);
    
    this.anchor.setTo(0.5, 0.5);
    this.tint = 0xFFFFFF;
    

    var sprite = this.game.add.sprite(0, 0, 'lightMask');
    sprite.anchor.setTo(0.5, 0.5);
    
    this.addChildAt(sprite, 0);

    this.kill();
};

ExplosionEffect.prototype = Object.create(Phaser.Sprite.prototype);
ExplosionEffect.prototype.constructor = ExplosionEffect;
    
ExplosionEffect.prototype.launch = function(x, y){ 
    var slowDown = 1;
    
    this.reset(x, y);
    this.alpha = 0.8;
    this.scale.setTo(4);
    this.children[0].scale.setTo(5);
    this.children[0].alpha = 0.2;
    
    var stage1 = this.game.add.tween(this.scale).to({x: 1.2, y: 1.2}, 50 * slowDown, "Linear", true);
    stage1.onComplete.add(function () {
        this.game.add.tween(this).to({alpha: 0}, 140, "Linear", true);
        var stage2 = this.game.add.tween(this.scale).to({x: 0.4, y: 0.4}, 140 * slowDown, "Linear", true);
        stage2.onComplete.add(function () {
            this.kill();
        }, this);
    }, this);  
};



       