export default class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene');
  }

  init(data) {
    this.finalScore = data.score;
  }

  create() {
    const scoreText = this.add.text(this.scale.width / 2, 400, `Score: ${this.finalScore}`, {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Arial',
    }).setOrigin(0.5).setAlpha(0).setScale(0.8);

    this.tweens.add({
      targets: scoreText,
      alpha: 1,
      scale: 1,
      ease: 'Back.Out',
      duration: 500,
    });

    // ✅ Sécuriser l’appel avec retry jusqu’à ce que window.onGameEnd soit bien dispo
    let retries = 0;
    const maxRetries = 100;

    const trySendScore = () => {
      console.log(`🔄 Tentative ${retries + 1} - Type actuel de window.onGameEnd:`, typeof window.onGameEnd);
      console.log("📊 Score à envoyer :", this.finalScore);

      if (window && typeof window.onGameEnd === "function") {
        console.log("✅ window.onGameEnd est disponible, appel en cours...");
        window.onGameEnd(this.finalScore);
      } else if (retries < maxRetries) {
        retries++;
        console.warn(`⏳ Retry ${retries}: window.onGameEnd non dispo, nouvel essai dans 200ms`);
        this.time.delayedCall(200, trySendScore); // essaie encore dans 200ms
      } else {
        console.error("❌ window.onGameEnd toujours undefined après", retries, "tentatives !");
      }
    };

    this.time.delayedCall(100, trySendScore);

    // 🔁 Bouton rejouer
    const replayText = this.add.text(this.scale.width / 2, 500, '🔁 Rejouer', {
      fontSize: '32px',
      fill: '#ffcc00',
      fontFamily: 'Arial',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    replayText.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}
