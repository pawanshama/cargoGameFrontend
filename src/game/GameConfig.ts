import Phaser from 'phaser';
// @ts-ignore: JS files don't have type declarations
import BootScene from './scenes/BootScene.js';
// @ts-ignore
import MenuScene from './scenes/MenuScene.js';
// @ts-ignore
import GameScene from './scenes/GameScene.js';
// @ts-ignore
import EndScene from './scenes/EndScene.js';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container', // ✅ Ajout essentiel pour que Phaser insère le canvas dans ton <div>
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 800 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, GameScene, EndScene],
};

export default config;
