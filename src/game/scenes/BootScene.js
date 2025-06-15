export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('hoop-top', 'assets/hoop-top.png');
    this.load.image('hoop-bot', 'assets/hoop-bot.png');
    this.load.image('background', 'assets/background.png');
    this.load.image('transparent', 'assets/transparent.png'); // nom harmonisé
  }

  create() {
    this.scene.start('MenuScene');
  }
}
