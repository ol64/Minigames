import Phaser from 'phaser'
import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import Menu from './scenes/Menu'

const config = {
	type: Phaser.AUTO,
	width: 700,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [Preloader, Menu, Game],
}

const game = new Phaser.Game(config)
