var game;
require(['game', 'gui/MenuWindow', 'GameWorld', 'entity/Player', 'entity/Zombie', 'CollisionHandler', 'ZombieSpawner', 'gui/GameInterface', 'effects/BloodSpirtEffect', 'entity/DeadZombieBody', 
         'entity/Blood', 'entity/Footstep', 'gui/HealthBarSprite', 'entity/Doors', 'entity/Grenade', 'effects/ExplosionEffect', 'entity/Medkit', 'entity/Turret',  'entity/GrenadePickup',
         'entity/TurretPickup', 'entity/Mass'], function () {
	game = new Phaser.Game(600, 480, Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render});
});