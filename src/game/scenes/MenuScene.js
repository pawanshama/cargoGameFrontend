export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    this.add.text(100, 300, 'Clique pour jouer', { fontSize: '20px', fill: '#fff' })
    this.input.once('pointerdown', () => {
      this.scene.start('GameScene')
    })
  }
}
