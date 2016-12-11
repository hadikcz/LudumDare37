/* global Phaser */
var Zombie = function(game, gameWorld, spawn){
    
    this.game = game;
    
    this.gameWorld = gameWorld;
    
    Phaser.Sprite.call(this, this.game, spawn.x, spawn.y, 'zombieAnimation', this.game.rnd.integerInRange(0, 9));
    this.game.add.existing(this);    
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(32, 32, 16, 16);  
    
    this.animations.add('walk', null, 0, true); 
    
    this.hp = 100;
    
    this.body.collideWorldBounds = true;
    this.body.bounce.x = 1;
    this.body.bounce.y = 1;
    this.body.minBounceVelocity = 0;
    
    this.canAttack = true;
    
    this.state = this.STATE_IDLE;
    
    this.targetDoors = {};
    
    this.canPutFootstep = true;
    
    this.destroyInNextTick = false;
    
    this.game.time.events.loop(800, function(){
        this.canPutFootstep = true;
    }, this);
    
    this.anchor.setTo(0.5);   
    
    this.zombieHit = game.add.audio('zombieHit');
    
    this.zombieDead = game.add.audio('zombieDead');
    this.zombieDead2 = game.add.audio('zombieDead2');
    this.punchSound = game.add.audio('zombiePunch');
    
};

Zombie.prototype = Object.create(Phaser.Sprite.prototype);
Zombie.prototype.constructor = Zombie;
Zombie.prototype.STATE_IDLE = 'IDLE';
Zombie.prototype.STATE_TO_DOOR = 'TO_DOOR';
Zombie.prototype.STATE_FOLLOW_PLAYER = 'FOLLOW_PLAYER';

Zombie.prototype.update = function(){
    // PHASER BUG ? Game crash when entaire group call destroy, by forEach. Cant simple destroy all zombies.
    if(player.hp <= 0){
        this.destroy();
    }
    try{
        if(this.state === this.STATE_IDLE){
            this.targetDoors = this.getNereastDoors();
            this.state = this.STATE_TO_DOOR;
        }

        // FOLLOWING DOORS
        if(this.state === this.STATE_TO_DOOR){
            var distance = this.game.physics.arcade.distanceBetween(this, this.targetDoors);

            // IS doors destroyed ??
            if(this.targetDoors.hp > 0){
                // NOT destroyed DOORS
                // IS so far then follow them
                if(distance > 40){
                    this.goToDoors();
                } else { // Is near, start attack and stop moving
                    if(this.canAttack){
                        this.targetDoors.hit(this.game.rnd.integerInRange(1, 15));
                        this.punchSound.play();
                        this.canAttack = false;
                        this.game.time.events.add(1000, function(){this.canAttack = true;}, this);
                    }
                    this.stopMove();
                }
            } else { // Doors are destroyed
                // Is doors too far, follow them
                if(distance > 20){
                    this.goToDoors();
                } else { // Destroyed doors reached
                    this.state = this.STATE_FOLLOW_PLAYER;
                }
            }
        }

        // FOLLOWING PLAYER
        if(this.state === this.STATE_FOLLOW_PLAYER){ 
            var distance = this.game.physics.arcade.distanceBetween(this, player);
            if(distance > 30){
                this.game.physics.arcade.moveToObject(this, player, 30);
                this.animations.play('walk', this.game.rnd.integerInRange(8, 10));        
            } else {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
                this.animations.currentAnim.setFrame(this.game.rnd.integerInRange(0, 9), true);
                this.animations.stop('walk');
            }

            if(distance <= 60){
                if(this.canAttack){
                    player.hit(this.game.rnd.integerInRange(1, 15));
                    this.punchSound.play();
                    this.canAttack = false;
                    this.game.time.events.add(1000, function(){this.canAttack = true;}, this);
                }
            }
            this.rotation = this.game.physics.arcade.angleBetween(this, player);
        }

        this.checkDead();

        if(this.canPutFootstep && (this.body.velocity.x !== 0 || this.body.velocity.y !== 0)){
            this.canPutFootstep = false;
            new Footstep(this.game, this.x, this.y, this.angle, 1);
        }
    }catch(e){};
};

Zombie.prototype.goToDoors = function(){
    this.game.physics.arcade.moveToObject(this, this.targetDoors, 50);
    this.animations.play('walk', this.game.rnd.integerInRange(10, 12));  
    this.rotation = this.game.physics.arcade.angleBetween(this, this.targetDoors);
};

Zombie.prototype.stopMove = function(){
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.animations.stop('walk');
};

Zombie.prototype.hit = function(damage){
    this.hp -= damage;
    new BloodSpirtEffect(this.game, this.x, this.y, this.angle);
    
    this.zombieHit.play();
    
    if(this.hp < 15){
        new Blood(this.game, this.x, this.y);
    }
};

Zombie.prototype.checkDead = function(){
    if(this.hp <= 0){
        this.die();
    }
};

Zombie.prototype.die = function(){
    new DeadZombieBody(this.game, this.x, this.y);
    
    var rnd = this.game.rnd.integerInRange(0, 1);
    if(rnd === 1){
        this.zombieDead.play();
    } else {
        this.zombieDead2.play();
    }
    
    zombieSpawner.killedZombies++;
    
    this.spawnPickup();
    
    this.destroy();
};

Zombie.prototype.getNereastDoors = function(){
    var nearestDistance = 99999;
    var nereastDoor = {};
    
    this.gameWorld.doors.forEach(function(door){
        var distance = this.game.physics.arcade.distanceBetween(this, door);
        if(distance < nearestDistance){
            nearestDistance = distance;
            nereastDoor = door;
        }
    }, this);
    
    return nereastDoor;
};

Zombie.prototype.spawnPickup = function(){
    var rnd = this.game.rnd.integerInRange(1, 10);
    if(rnd === 1){
        var medkit = new Medkit(this.game, this.x, this.y);
        deployables.add(medkit);
    }
    
    var rnd = this.game.rnd.integerInRange(1, 20);
    if(rnd === 1){
        var grenadePickup = new GrenadePickup(this.game, this.x, this.y);
        deployables.add(grenadePickup);
    }
    
    var rnd = this.game.rnd.integerInRange(1, 50);
    if(rnd === 1){
        var grenadePickup = new TurretPickup(this.game, this.x, this.y);
        deployables.add(grenadePickup);
    }
    
};
