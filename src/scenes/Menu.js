import Phaser from 'phaser'

export default class Menu extends Phaser.Scene {
	constructor() {
		super('menu')
	}

	create() {
		const { width, height } = this.scale
		const x = width / 2
		const y = height / 2

		//background
		const background = this.add.image(x, y, 'background')
		background.setScale(1.2)

		//background music
		const bgm = this.sound.add('bgm', { volume: 0.5 })
		bgm.loop = true
		bgm.play()
		this.add
			.text(x, y - 50, 'MEMORY MATCH!', {
				fontFamily: 'Grandstander',
				fontSize: '55px',
				color: '#4A4A4A',
				fontStyle: 'normal',
				strokeThickness: 3,
				padding: { left: 30, right: 30, top: 5, bottom: 5 },
			})
			.setOrigin(0.5)

		const audio = this.add.image(650, 25, 'audio').setScale(0.04)
		const mute = this.add.image(650, 25, 'mute').setScale(0.04)
		mute
			.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
				this.toggleAudioState(mute, audio)
				bgm.pause()
			})
		audio
			.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
				this.toggleAudioState(mute, audio)
				bgm.resume()
			})
		audio.setVisible(false)

		//play button
		const play = this.add
			.text(x, y + 50, '< PLAY >', {
				fontFamily: 'Grandstander',
				fontSize: '40px',
				color: '#4A4A4A',
				fontStyle: 'normal',
			})
			.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
				bgm.stop()
				this.scene.start('game')
			})
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
				play.setShadowBlur(3)
				play.setShadowColor('#ffffff')
				play.setShadowFill(true)
			})
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
				play.setShadowBlur(0)
				play.setShadowFill(false)
			})
			.setOrigin(0.5)
	}

	hoverOver(play) {
		play.setTint(0xffffff)
	}

	toggleAudioState(mute, audio) {
		if (mute.visible) {
			mute.setVisible(false)
		} else {
			mute.setVisible(true)
		}
		if (audio.visible) {
			audio.setVisible(false)
		} else {
			audio.setVisible(true)
		}
	}
}
