/* global, global GameWorld, Phaser */

var GameWorld = function(game){
    this.game = game;
    
    this.game.world.setBounds(0, 0, 1280, 960);
    this.game.stage.backgroundColor = '#DDDDDD';
    
    this.tilemap;
    
    this.zombieSpawns = [];
    
    this.playerSpawn = new Phaser.Point(0, 0);
    
    this.doorsSettings = [];
    
    
    this.createTilemap();
    this.createDoors();
};

GameWorld.prototype = {
    createTilemap: function(){
        this.tilemap = this.game.add.tilemap('map');
        this.tilemap.addTilesetImage('tileset2', 'tileset');
        this.tilemap.layer = [];
        this.tilemap.layer[0] = this.tilemap.createLayer('ground');
        this.tilemap.layer[0].resizeWorld();
        this.tilemap.layer[1] = this.tilemap.createLayer('ground2');
        this.tilemap.layer[1].resizeWorld();
        this.tilemap.layer[2] = this.tilemap.createLayer('onGround');
        this.tilemap.layer[2].resizeWorld();
        this.tilemap.layer[3] = this.tilemap.createLayer('collide');
        this.tilemap.layer[3].resizeWorld();
        
        this.tilemap.setCollisionBetween(0, 9999, true, this.tilemap.layer[3]);
        
        this.zombieSpawns = this.tilemap.objects.zombieSpawns;
        this.playerSpawn = this.tilemap.objects.playerSpawns[0];
        this.doorsSettings = this.tilemap.objects.doors;
    },
    createDoors: function(){
        this.doors = this.game.add.group();
        this.doorsSettings.forEach(function(door){
            var doorEntity = new Doors(this.game, door.x, door.y, door.rotation);
            this.doors.add(doorEntity);
        }, this);
    },
    update: function(){
        
    },
    getObjectsByType: function(type, map){
        var objects = [];
        map.objects.objLayer.forEach(function(row){
            if(row.type === type){
                objects.push(row);
            }
        });
        return objects;
    },
    restart: function(){
        zombieSpawner.restart();
        this.restartDoors();
        player.restart();
    },
    restartDoors: function(){
        this.doors.forEach(function(door){
            door.restart();
        });
    }
};