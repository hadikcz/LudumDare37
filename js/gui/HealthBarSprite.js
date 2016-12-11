var HealthBarSprite = function(game, providedConfig) {
    
    this.game = game;
    this.config = providedConfig;
    
    this.bgSprite;
    this.barSprite;
    
    this.drawBackground();
    this.drawHealthBar();
    
    this.setPosition(this.config.x, this.config.y);
    
    if(this.config.fixedToCamera === true){
        this.setFixedToCamera(this.config.isFixedToCamera);
    }
};


HealthBarSprite.prototype.constructor = HealthBarSprite;

HealthBarSprite.prototype.drawBackground = function() {
    if(typeof this.config.bgSprite !==  'undefined'){
        this.bgSprite = this.game.add.sprite(this.config.x, this.config.y, this.config.bgSprite);
    } else {
        this.bgSprite = this.game.add.sprite(this.config.x, this.config.y, this.config.spriteSheet, 0);
    }
};

HealthBarSprite.prototype.drawHealthBar = function() {
    if(typeof this.config.barSprite !==  'undefined'){
        this.barSprite = this.game.add.sprite(this.config.x, this.config.y, this.config.barSprite);
    } else {
        this.barSprite = this.game.add.sprite(this.config.x, this.config.y, this.config.spriteSheet, 1);
    }
    
    if(this.config.vertical === false){
        this.barSprite.scale.setTo(0.0, 1);
    } else {
        this.barSprite.scale.setTo(1, 0.0);
    }    
};

HealthBarSprite.prototype.setPercent = function(percent, delay){
    var newScale = {};
    if(percent < 0){
        percent = 0;
    }
    
    if(this.config.vertical === false){
        newScale.x = percent / 100;
        newScale.y = 1;
    } else {
        newScale.x = 1;
        newScale.y = percent / 100;
    }
    
    if(typeof delay === 'undefined' || delay === 0){
        var delay = this.config.delay;
    } 
    this.game.add.tween(this.barSprite.scale).to(newScale, delay, Phaser.Easing.Linear.None, true);
    
};

HealthBarSprite.prototype.setPosition = function(x, y){
    this.bgSprite.x = x;
    this.bgSprite.y = y;
    
    this.barSprite.x = x + this.config.barOffesetX;
    this.barSprite.y = y + this.config.barOffesetY;
};

HealthBarSprite.prototype.setFixedToCamera = function(){
    this.bgSprite.fixedToCamera = true;
    this.barSprite.fixedToCamera = true;
};

HealthBarSprite.prototype.destroy = function(){
    this.bgSprite.destroy();
    this.barSprite.destroy();
};

HealthBarSprite.prototype.hide = function(){
    this.bgSprite.visible = false;
    this.barSprite.visible = false;
};

HealthBarSprite.prototype.show = function(){
    this.bgSprite.visible = true;
    this.barSprite.visible = true;
};

HealthBarSprite.prototype.addToGroup = function(group){
    group.add(this.bgSprite);
    group.add(this.barSprite);
};

HealthBarSprite.prototype.tweenShow = function(time){
    this.bgSprite.alpha = 0;
    this.barSprite.alpha = 0;
    this.bgSprite.visible = true;
    this.barSprite.visible = true;
    
    this.game.add.tween(this.bgSprite).to({alpha: 1}, time, Phaser.Easing.Linear.None, true); 
    this.game.add.tween(this.barSprite).to({alpha: 1}, time, Phaser.Easing.Linear.None, true); 
};