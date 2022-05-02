import Phaser from 'phaser'

//assets
//backgrounds
import background from '../assets/background.jpeg'
import gameBackground from '../assets/woodfloor.png'
import mute from '../assets/mute.png'
import audio from '../assets/audio.png'
import bgm from '../assets/zelda-theme.mp3'
import gameBGM from '../assets/zelda-searching.mp3'
import WebFontFile from '../assets/WebFontFile'

//spites
import sokoban from '../assets/sokoban_tilesheet.png'
import bear from '../assets/bear.png'
import chicken from '../assets/chicken.png'
import elephant from '../assets/elephant.png'
import penguin from '../assets/penguin.png'
import pig from '../assets/pig.png'

class Preloader extends Phaser.Scene {
	constructor() {
		super('preloader')
	}

	preload() {
		//menu
		this.load.image('background', background)
		this.load.audio('bgm', [bgm])
		const fonts = new WebFontFile(this.load, 'Grandstander')
		this.load.addFile(fonts)
		this.load.image('audio', audio)
		this.load.image('mute', mute)

		//game
		this.load.image('gameBackground', gameBackground)
		this.load.audio('gameBGM', [gameBGM])
		this.load.spritesheet('sokoban', sokoban, { frameWidth: 64 })
		this.load.image('bear', bear)
		this.load.image('chicken', chicken)
		this.load.image('elephant', elephant)
		this.load.image('penguin', penguin)
		this.load.image('pig', pig)
	}

	create() {
		//controllers
		this.anims.create({
			key: 'down-idle',
			frames: [{ key: 'sokoban', frame: 52 }],
		})

		this.anims.create({
			key: 'down-walk',
			frames: this.anims.generateFrameNumbers('sokoban', {
				start: 52,
				end: 54,
			}),
			frameRate: 10,
			repeat: -1,
		})

		this.anims.create({
			key: 'up-idle',
			frames: [{ key: 'sokoban', frame: 55 }],
		})

		this.anims.create({
			key: 'up-walk',
			frames: this.anims.generateFrameNumbers('sokoban', {
				start: 55,
				end: 57,
			}),
			frameRate: 10,
			repeat: -1,
		})

		this.anims.create({
			key: 'left-idle',
			frames: [{ key: 'sokoban', frame: 81 }],
		})

		this.anims.create({
			key: 'left-walk',
			frames: this.anims.generateFrameNumbers('sokoban', {
				start: 81,
				end: 83,
			}),
			frameRate: 10,
			repeat: -1,
		})

		this.anims.create({
			key: 'right-idle',
			frames: [{ key: 'sokoban', frame: 78 }],
		})

		this.anims.create({
			key: 'right-walk',
			frames: this.anims.generateFrameNumbers('sokoban', {
				start: 78,
				end: 80,
			}),
			frameRate: 10,
			repeat: -1,
		})

		this.scene.start('menu')
	}
}

export default Preloader
