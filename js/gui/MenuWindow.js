var MenuWindow = function(game){
    /**
     * @property {Phaser} game - Main game context
     * @private
     */
    this.game = game;
    
    /**
     * @property {Phaser.Group} gui - Group for all interface parts
     * @private
     */
    this.gui = this.game.add.group();

    this.create();
};

MenuWindow.prototype = {

    create: function(){
        var gameName  = this.game.add.text(this.game.width / 2, 70, 'Can I leave?', {fill: 'white', font: 'bold 25px Arial'});
        gameName.anchor.setTo(0.5);
        gameName.stroke = "#000000";
        gameName.strokeThickness = 5;
        
        var continueText  = this.game.add.text(this.game.width / 2, 120, 'Click/tap on the game for continue', {fill: 'gray', font: 'bold 15px Arial'});
        continueText.anchor.setTo(0.5);
        continueText.stroke = "#FFFFFF";
        continueText.strokeThickness = 2;
        
        var credits = this.game.add.text(5, this.game.height - 13, 'Created by Hadik 2016 for LudumDare 37', {fill: 'white', font: 'bold 11px Arial'});
        
        var menuBackground = this.game.add.sprite(0, 0, 'bg');
        
        
        this.gui.add(menuBackground);
        this.gui.add(gameName);
        this.gui.add(continueText);
        this.gui.add(credits);
        
    },
    update: function(){
        if(this.game.input.activePointer.leftButton.isDown){
            this.hide();
            isStarted = true;
            startGame();
        }
        
    },
    show: function(){
        this.gui.visible = true;
    },
    hide: function(){
        this.gui.visible = false;
    },
    destroy: function(){
        this.gui.destroy();
    }
};