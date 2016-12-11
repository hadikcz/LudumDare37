/* global Phaser */
var Doors = function(game, x, y, angle){
    
    this.game = game;
    
    Phaser.Sprite.call(this, this.game, x, y, 'tileset', 25);
    this.game.add.existing(this);    
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(0.5);
    this.angle = angle;
    
    this.immovable = true;
    this.body.moves = false;
    
    var secondFootstep = this.game.add.sprite(0, 0, 'tileset', 25);
    secondFootstep.pivot.x = -30;
    secondFootstep.anchor.setTo(0.5);
    
    this.game.physics.enable(secondFootstep, Phaser.Physics.ARCADE);
    
    this.addChild(secondFootstep);
    
    this.hp = 250;
    this.maxHp = 250; // 500

    this.healtBar = new HealthBarSprite(this.game, {
        x: this.x,
        y: this.y,
        fixedToCamera: false,
        vertical: false,
        barSprite: 'doorHpBar',
        bgSprite: 'doorHpBg',
        barOffesetX: 0,
        barOffesetY: 0,
        delay: 300,
    });
    this.healtBar.setPercent(100);    
    
    this.doorDestroySound = game.add.audio('doorDestroy');
    
};

Doors.prototype = Object.create(Phaser.Sprite.prototype);
Doors.prototype.constructor = Doors;

Doors.prototype.hit = function(damage){
    this.hp -= damage;
    
    var percentage = Math.round(100 * (this.hp / this.maxHp));
    this.healtBar.setPercent(percentage);
    
    if(this.hp <= 0){
        this.doorDestroySound.play();
        this.alpha = 0;
        this.body = null;
        this.healtBar.hide();
    }
};

Doors.prototype.restart = function(){
    this.game.physics.enable(this, Phaser.Physics.ARCADE);  
    this.hp = this.maxHp;
    this.healtBar.setPercent(100);
    var tween = this.game.add.tween(this).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true); 
    tween.onComplete.add(function(){
        this.healtBar.tweenShow(1000);
    }, this);
    this.immovable = true;
    this.body.moves = false;
};