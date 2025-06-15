export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.audio('jump', 'assets/sounds/9jump-corgi.mp3');
    this.load.audio('perfect1', 'assets/sounds/11perfect1.mp3');
    this.load.audio('perfect2', 'assets/sounds/14.PERFECT 2.mp3');
    this.load.audio('perfect3', 'assets/sounds/18.Perfect 3.mp3');
    this.load.image('transparent', 'assets/transparent.png');

  }

  create() {
    this.score = 0;


    this.jumpSound = this.sound.add('jump');

    this.perfectStreak = 0;
    this.perfect1Sound = this.sound.add('perfect1');
    this.perfect2Sound = this.sound.add('perfect2');
    this.perfect3Sound = this.sound.add('perfect3');

   this.touchedHoopWall = false;



    this.background = this.add.tileSprite(
  0,
  0,
  this.scale.width,
  this.scale.height,
  'background'
).setOrigin(0).setScrollFactor(0);

    this.scoreText = this.add.text(10, 10, 'Score: 0', {
      fontSize: '20px',
      fill: '#fff'
    }).setScrollFactor(0);

    this.ball = this.physics.add.sprite(80, 300, 'ball');
    this.ball.setScale(0.06);
    this.ball.setCollideWorldBounds(true);
    this.ball.body.allowGravity = true;
    this.ball.setDepth(2);

// Définir un cercle de collision parfait
const radius = this.ball.displayWidth / 10;
this.ball.body.setCircle(radius);


// Taille du cercle (par exemple 12px de rayon)
//this.ball.body.setCircle(300);

// Décalage du cercle pour le centrer
this.ball.body.setOffset(200, 200); // ⇐ à ajuster visuellement selon le sprite


    this.input.on('pointerdown', () => {
      this.ball.setVelocityY(-330);
      this.jumpSound.play();
    });

    this.hoops = [];
    this.scoreZones = this.physics.add.group();
    this.hoopWalls = this.physics.add.staticGroup();

this.physics.add.collider(this.ball, this.hoopWalls, () => {
  this.touchedHoopWall = true;

  // Supprime le rebond temporairement pour ce contact
  this.ball.setBounce(0);

  // Donne une petite rotation comme effet de roulement
  this.ball.setAngularVelocity(Phaser.Math.Between(-100, 100));



});


    this.physics.add.overlap(this.ball, this.scoreZones, this.handleScore, null, this);

    this.hoopSpacing = 240;
    this.spawnTimer = 0;
  }

  spawnHoop(x = 400, y = Phaser.Math.Between(180, 480)) {
    const hoopTop = this.add.image(x, y, 'hoop-top').setScale(0.12).setDepth(1);
    const hoopBot = this.add.image(x, y, 'hoop-bot').setScale(0.12).setDepth(3);

    const left = this.physics.add.staticImage(x - 3, y, 'transparent');
    left.setSize(-10, 10).refreshBody().setVisible(false);


    const right = this.physics.add.staticImage(x + 3, y, 'transparent');
    right.setSize(20, 10).refreshBody().setVisible(false);

    const rightin = this.physics.add.staticImage(x + 3, y, 'transparent');
    rightin.setSize(50, 10).refreshBody().setVisible(false);

    const leftin = this.physics.add.staticImage(x + 3, y, 'transparent');
    leftin.setSize(-50, 10).refreshBody().setVisible(false);


    this.hoopWalls.add(left);
    this.hoopWalls.add(right);
    this.hoopWalls.add(rightin);
    this.hoopWalls.add(leftin);

    const zone = this.scoreZones.create(x, y - -20, null);
    zone.setSize(30, 10);
    zone.setOrigin(0.5);
    zone.setVisible(false);
    zone.scored = false;
    zone.body.setAllowGravity(false);
    zone.body.setImmovable(true);

    this.hoops.push({
      top: hoopTop,
      bot: hoopBot,
      left,
      right,
      rightin,
      leftin,
      zone,
      x
    });
  }

  handleScore(ball, zone) {
    if (zone.scored) return;
    zone.scored = true;
let points = 1; // Par défaut

if (!this.touchedHoopWall) {
  this.perfectStreak++;
  points = this.perfectStreak + 1; // perfect1 = 2 pts, perfect2 = 3 pts, etc.

  if (this.perfectStreak === 1) {
    this.perfect1Sound.play();
  } else if (this.perfectStreak === 2) {
    this.perfect2Sound.play();
  } else {
    this.perfect3Sound.play();
  }
} else {
  this.perfectStreak = 0;
}

this.score += points;
this.scoreText.setText('Score: ' + this.score);

// Reset pour le prochain panier
this.touchedHoopWall = false;


// reset pour le prochain panier
this.touchedHoopWall = false;



  }

  gameOver() {
    this.scene.start('EndScene', { score: this.score });
  }

  update(time, delta) {
    this.background.tilePositionX += 1.5;




    const dx = -2;
    this.hoops = this.hoops.filter(h => {
      h.x += dx;

      h.top.x = h.bot.x = h.x;

      h.left.body.reset(h.x - 60, h.left.y);
      h.leftin.body.reset(h.x - 60, h.leftin.y);
      h.right.body.reset(h.x + 60, h.right.y);
      h.rightin.body.reset(h.x + 60, h.rightin.y);
      h.zone.body.reset(h.x, h.zone.y);

      if (h.x < -50) {
        h.top.destroy();
        h.bot.destroy();
        h.left.destroy();
        h.right.destroy();
        h.zone.destroy();
        return false;
      }

      return true;
    });

    this.spawnTimer += delta;
    if (this.spawnTimer > 1500) {
      this.spawnHoop();
      this.spawnTimer = 0;
    }

    if (this.ball.y > this.scale.height || this.ball.y < 0) {
  this.gameOver();
}
  }
}
