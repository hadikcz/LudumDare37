var CollisionHandler = function(game, player, bullets, zombies, gameWorld){
    
    this.game = game;
    
    this.zombies = zombies;
    
    this.bullets = bullets;
    
    this.player = player;
    
    this.gameWorld = gameWorld;
    
    this.canToxicHit = false;
};

CollisionHandler.prototype.update = function(){
    this.game.physics.arcade.overlap(this.bullets, this.zombies, function(bullet, zombie){
        zombie.hit(this.game.rnd.integerInRange(20, 25));
        bullet.kill();
    }, null, this);
    
    
    this.game.physics.arcade.collide(this.zombies, this.player);
    this.game.physics.arcade.collide(this.zombies, this.gameWorld.tilemap.layer[3]);
    this.game.physics.arcade.collide(this.player, this.gameWorld.tilemap.layer[3]);
    this.game.physics.arcade.collide(this.gameWorld.tilemap.layer[3], grenades);
    
    
    this.game.physics.arcade.collide(this.zombies, this.gameWorld.doors);
    this.game.physics.arcade.collide(this.player, this.gameWorld.doors);
    this.game.physics.arcade.collide(this.zombies, grenades);
    this.game.physics.arcade.collide(this.player, grenades);
    this.game.physics.arcade.collide(grenades);
    
    
    
    this.game.physics.arcade.collide(deployables);
    this.game.physics.arcade.collide(this.gameWorld.tilemap.layer[3], deployables);
    this.game.physics.arcade.collide(this.zombies, deployables);
    
    
    this.game.physics.arcade.overlap(this.bullets, this.gameWorld.tilemap.layer[3], function(bullet, layer){
        if(typeof layer.properties.solid !== 'undefined' && typeof layer.properties.shootable == 'undefined'){
            bullet.kill();
        }
    }, null, this);
    
    
    this.game.physics.arcade.overlap(player, this.gameWorld.tilemap.layer[0], function(player, layer){
        if(typeof layer.properties.toxic !== 'undefined'){
            if(this.canToxicHit){
                player.hit(10);
                this.canToxicHit = false;
                this.game.time.events.add(300, function(){this.canToxicHit = true;}, this);
            }
        }
    }, null, this);
    
    
    this.game.physics.arcade.overlap(deployables, this.player, function(player, deployable){
        deployable.pick();
    }, null, this);
};