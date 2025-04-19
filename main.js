// Phaser 3 WWII Shooting Game Basic Setup

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: [BootScene, PreloadScene, MainMenuScene, StoryMissionScene, MultiplayerScene, GameplayScene],
};

let game;

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }
  preload() {
    // Load any assets needed for loading screen here
  }
  create() {
    this.scene.start('PreloadScene');
  }
}

class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }
  preload() {
    // Load assets here
    // Placeholder assets URLs or simple shapes for now
    this.load.image('player', 'https://cdn.pixabay.com/photo/2017/01/31/21/23/soldier-2022827_1280.png');
    this.load.image('bullet', 'https://cdn.pixabay.com/photo/2013/07/12/18/20/bullet-152073_1280.png');
    this.load.image('enemy', 'https://cdn.pixabay.com/photo/2017/01/31/21/23/soldier-2022827_1280.png');
    this.load.image('background', 'https://cdn.pixabay.com/photo/2016/11/29/03/53/war-1869236_1280.jpg');
  }
  create() {
    this.scene.start('MainMenuScene');
  }
}

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }
  create() {
    const { width, height } = this.sys.game.config;
    this.add.text(width / 2, height / 2 - 100, 'WWII Shooting Game', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
    const startButton = this.add.text(width / 2, height / 2, 'Start Story Missions', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5).setInteractive();
    startButton.on('pointerdown', () => {
      this.scene.start('StoryMissionScene');
    });
    const multiplayerButton = this.add.text(width / 2, height / 2 + 60, 'Multiplayer Mode', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5).setInteractive();
    multiplayerButton.on('pointerdown', () => {
      this.scene.start('MultiplayerScene');
    });
  }
}

class StoryMissionScene extends Phaser.Scene {
  constructor() {
    super('StoryMissionScene');
  }
  create() {
    const { width, height } = this.sys.game.config;
    this.add.text(width / 2, 50, 'Story Missions - WWII Historical Events', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    // Placeholder for missions list
    this.add.text(width / 2, height / 2, 'Mission 1: D-Day Landing', { fontSize: '28px', fill: '#ff0' }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
      this.scene.start('GameplayScene', { mission: 'D-Day Landing' });
    });
    this.add.text(width / 2, height / 2 + 50, 'Mission 2: Battle of Stalingrad', { fontSize: '28px', fill: '#ff0' }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
      this.scene.start('GameplayScene', { mission: 'Battle of Stalingrad' });
    });
    const backButton = this.add.text(20, 20, '< Back to Menu', { fontSize: '20px', fill: '#0f0' }).setInteractive();
    backButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }
}

class MultiplayerScene extends Phaser.Scene {
  constructor() {
    super('MultiplayerScene');
  }
  create() {
    const { width, height } = this.sys.game.config;
    this.add.text(width / 2, height / 2, 'Multiplayer Mode Coming Soon!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    const backButton = this.add.text(20, 20, '< Back to Menu', { fontSize: '20px', fill: '#0f0' }).setInteractive();
    backButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }
}

class GameplayScene extends Phaser.Scene {
  constructor() {
    super('GameplayScene');
  }
  init(data) {
    this.mission = data.mission || 'Unknown Mission';
  }
  create() {
    const { width, height } = this.sys.game.config;
    this.add.text(width / 2, 20, `Mission: ${this.mission}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    // Player setup
    this.player = this.physics.add.sprite(width / 2, height - 50, 'player').setScale(0.1);
    this.player.setCollideWorldBounds(true);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Bullets group
    this.bullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 10,
    });

    // Enemies group
    this.enemies = this.physics.add.group();

    // Spawn enemies
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    // Collisions
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);

    // Score
    this.score = 0;
    this.scoreText = this.add.text(20, 50, 'Score: 0', { fontSize: '20px', fill: '#fff' });

    // Weapon upgrades and equipment placeholder
    this.weaponLevel = 1;

    // AI behavior placeholder
  }
  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
      this.shootBullet();
    }
  }
  shootBullet() {
    const bullet = this.bullets.get(this.player.x, this.player.y - 20);
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.body.velocity.y = -300;
    }
  }
  spawnEnemy() {
    const x = Phaser.Math.Between(50, this.sys.game.config.width - 50);
    const enemy = this.enemies.create(x, 0, 'enemy').setScale(0.1);
    enemy.body.velocity.y = 100;
    enemy.setCollideWorldBounds(true);
    enemy.setBounce(1);
  }
  hitEnemy(bullet, enemy) {
    bullet.disableBody(true, true);
    enemy.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
  }
}

window.onload = function () {
  game = new Phaser.Game(config);
};
