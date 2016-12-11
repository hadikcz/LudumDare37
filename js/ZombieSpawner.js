/* global, global ZombieSpawner, Phaser */

var ZombieSpawner = function(game, gameWorld, zombies){
    
    this.game = game;
    
    this.gameWorld = gameWorld;
    
    /**
     * 
     * @param {Phaser.Group} Group of all zombies
     */
    this.zombies = zombies;
    
    this.zombieLimit = 5; // 100    
    this.killedZombies = 0;
    
    this.round = 1;
    
    this.isWaitingToNextRound = false;
    
    this.spawnZombies();
    this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.spawnZombies, this);
};

ZombieSpawner.prototype = {
    update: function(){
	   this.game.physics.arcade.collide(this.zombies);
	   this.game.physics.arcade.collide(this.zombies, player);
        
        if(this.zombieLimit == this.killedZombies && this.isWaitingToNextRound === false){
          this.roundFinished();
        }
        gameInterface.zombieLimit.setText("Zombies: " + Math.round(this.zombieLimit - this.killedZombies) + "/" + this.zombieLimit);
    },
    spawnZombies: function(){
        var count = this.game.rnd.integerInRange(4, 50);
        for(var i = 0; i < count; i++){
            if(this.canCreateAnotherZombie()){
                var zombie = new Zombie(this.game, this.gameWorld, this.getSpawn());
                this.zombies.add(zombie);
            }
        }
    },
    getSpawn: function(){
        var spawnArea = this.gameWorld.zombieSpawns[Math.floor(Math.random() * this.gameWorld.zombieSpawns.length)];
        var spawn = new Phaser.Point();
        spawn.x = this.game.rnd.integerInRange(spawnArea.x, spawnArea.x + spawnArea.width);
        spawn.y = this.game.rnd.integerInRange(spawnArea.y, spawnArea.y + spawnArea.height);
        return spawn;
    },
    canCreateAnotherZombie: function(){
        if(this.zombies.children.length < this.zombieLimit - this.killedZombies){
            return true;
        }
        return false;
    },
    restart: function(){         
        // This will crash the game, cant destroy whole group
       /* do{
            this.zombies.forEach(function(zombie){
                zombie.destroy();s
            }, this);
        } while(this.zombies.children.length >= 0);*/
        
        gameInterface.showCenterText("Round failed");
        this.isWaitingToNextRound = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 5, function(){  
            this.isWaitingToNextRound = false;
            this.killedZombies = 0;
            gameInterface.showCenterText("Round " + zombieSpawner.round + " started");
            player.restart();
        }, this);
    },
    roundFinished: function(){  
        this.isWaitingToNextRound = true;
        gameInterface.showCenterText("Finished round");
        this.game.time.events.add(Phaser.Timer.SECOND * 5, function(){   
            this.round++;
            this.killedZombies = 0;
            this.zombieLimit += Math.round(this.zombieLimit * 0.25);
            gameInterface.roundCounter.setText("Round: " + this.round);
            gameWorld.restartDoors();
            this.isWaitingToNextRound = false;
            gameInterface.showCenterText("Next round " + zombieSpawner.round + " started");
            player.restart();
        }, this);
    },
};