var GameInterface = function(game){
    /**
     * @property {Phaser} game - Main game context
     * @private
     */
    this.game = game;
    
    /**
     * @property {Phaser.Group} gui - Group for all interface parts
     * @private
     */
    
    this.guiNotFixed = this.game.add.group();
    
    this.gui = this.game.add.group();
    
    this.healthBar;
    
    this.roundCounter;
    

    this.create();
};

GameInterface.prototype = {

    create: function(){        
        this.gui.fixedToCamera = true;
        
        var bmd = game.add.bitmapData(game.width, game.width);
        bmd.fill(255, 0, 0, 255);
        this.redScreen = this.game.add.sprite(0, 0, bmd);
        this.redScreen.fixedToCamera = true;
        this.redScreen.alpha = 0;
        
        this.healtBar = new HealthBarSprite(this.game, {
            x: 0,
            y: this.game.height - 30,
            fixedToCamera: true,
            vertical: false,
            barSprite: 'hpBar',
            bgSprite: 'hpBg',
            barOffesetX: 0,
            barOffesetY: 0,
            delay: 300,
        });
        this.healtBar.setPercent(100);
        
        gameWorld.doors.forEach(function(door){
            door.healtBar.addToGroup(this.guiNotFixed);
        }, this);
        
        this.roundCounter = this.game.add.text(this.game.width / 2, 15, "Round: 1", {fill: 'white', font: '20px Arial'});
        this.roundCounter.anchor.setTo(0.5);
        this.roundCounter.stroke = "#000000";
        this.roundCounter.strokeThickness = 2;
        this.gui.add(this.roundCounter);
        
        this.zombieLimit = this.game.add.text(20, 15, "Zombies: 0/5", {fill: 'white', font: '18px Arial'});
        this.zombieLimit.stroke = "#000000";
        this.zombieLimit.strokeThickness = 2;
        this.gui.add(this.zombieLimit);   
        
        this.roundStarted = this.game.add.text(this.game.width / 2, this.game.height / 2 - 100, "", {fill: 'white', font: '30px Arial'});
        this.roundStarted.anchor.setTo(0.5);
        this.roundStarted.alpha = 0;
        this.roundStarted.stroke = "#000000";
        this.roundStarted.strokeThickness = 2;
        this.gui.add(this.roundStarted);   
        
        var grenadeIcon = this.game.add.sprite(15, this.game.height - 45, 'grenade');
        grenadeIcon.anchor.setTo(0.5);
        grenadeIcon.scale.setTo(2.5);
        this.gui.add(grenadeIcon);
        
        this.grenadeCount = this.game.add.text(40, this.game.height - 42, player.weaponGrenades, {fill: 'white', font: '18px Arial'});
        this.grenadeCount.anchor.setTo(0.5);
        this.gui.add(this.grenadeCount);
        
        var turretIcon = this.game.add.sprite(15, this.game.height - 68, 'turretPickup');
        turretIcon.anchor.setTo(0.4, 0.6);
        turretIcon.scale.setTo(1);
        this.gui.add(turretIcon);
        
        this.turretCount = this.game.add.text(40, this.game.height - 70, player.turrets, {fill: 'white', font: '18px Arial'});
        this.turretCount.anchor.setTo(0.5);
        this.gui.add(this.turretCount);
        
    },
    update: function(){
        
    },
    show: function(){
        this.gui.visible = true;
    },
    hide: function(){
        this.gui.visible = false;
    },
    destroy: function(){
        this.gui.destroy();
    },
    redScreenEffect: function(){
        this.redScreen.alpha = 0.8;
        this.game.add.tween(this.redScreen).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
    },
    showCenterText: function(text){
        this.roundStarted.setText(text);
        var tween = this.game.add.tween(this.roundStarted).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true); 
        tween.onComplete.add(function(){
            this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){   
                this.game.add.tween(this.roundStarted).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true); 
            }, this);
        }, this);
    },
};