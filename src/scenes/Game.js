import Phaser from 'phaser'
import CountdownController from './CountdownController'

function randomLevels(arr) {
	let randomIdx
	for (let i = arr.length - 1; i > 0; i--) {
		randomIdx = Math.floor(Math.random() * i)
		let temp = arr[i]
		arr[i] = arr[randomIdx]
		arr[randomIdx] = temp
	}
	let levels = []
	for (let i = 0; i < arr.length / 3; i++) {
		levels.push([arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2]])
	}
	return levels
}

class Game extends Phaser.Scene {
	constructor() {
		super('game')
	}

	init() {
		this.cursors = this.input.keyboard.createCursorKeys()
		this.bgm = this.sound.add('gameBGM', { volume: 0.5 })
		this.level = randomLevels([0, 1, 1, 2, 2, 3, 3, 4, 4])
	}

	create() {
		const { width, height } = this.scale
		const x = width / 2
		const y = height / 2

		//background
		const background = this.add.image(x, y, 'gameBackground')
		background.setData('sorted', true)
		background.setDepth(-1000)

		this.bgm.play()

		//quit, play again buttons
		const quit = this.add
			.text(650, 25, 'QUIT', {
				fontFamily: 'Grandstander',
				fontSize: '30px',
				color: '#FFFFFF',
				fontStyle: 'normal',
			})
			.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
				this.bgm.stop()
				this.scene.start('preloader')
			})
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
				quit.setShadowBlur(3)
				quit.setShadowColor('#ffffff')
				quit.setShadowFill(true)
			})
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
				quit.setShadowBlur(0)
				quit.setShadowFill(false)
			})
			.setOrigin(0.5)

		//audio buttons
		this.add.circle(600, 25, 14, 0xffffff)
		const audio = this.add.image(600, 25, 'audio').setScale(0.04)
		const mute = this.add.image(600, 25, 'mute').setScale(0.04)
		mute
			.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
				this.toggleAudioState(mute, audio)
				this.bgm.pause()
			})
		audio
			.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
				this.toggleAudioState(mute, audio)
				this.bgm.resume()
			})
		audio.setVisible(false)

		this.matchesCount = 0
		const timerLabel = this.add
			.text(width / 2, 50, '45', { fontSize: 40 })
			.setOrigin(0.5)
		this.countdown = new CountdownController(this, timerLabel)
		this.countdown.start(this.handleCountdownFinished.bind(this))

		//player
		this.player = this.physics.add
			.sprite(width * 0.5, height * 0.6, 'sokoban')
			.setSize(32, 32)
			.setOffset(16, 32)
			.play('down-idle')
		this.player.setCollideWorldBounds(true)

		//boxes
		this.boxGroup = this.physics.add.staticGroup()
		this.createBoxes()
		this.itemsGroup = this.add.group()
		this.selectedBoxes = []

		//collider
		this.physics.add.collider(
			this.player,
			this.boxGroup,
			this.handlePlayerBoxCollide,
			undefined,
			this
		)
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

	createBoxes() {
		const { width } = this.scale
		let x = 0.25
		let y = 150
		for (let row = 0; row < this.level.length; row++) {
			for (let col = 0; col < this.level[row].length; col++) {
				const box = this.boxGroup.get(width * x, y, 'sokoban', 10)
				box
					.setSize(64, 32)
					.setOffset(0, 32)
					.setData('itemType', this.level[row][col])
				x += 0.25
			}
			x = 0.25
			y += 150
		}
	}

	resultPage(str) {
		const { width, height } = this.scale
		const x = width / 2
		const y = height / 2
		let result
		if (str === 'lose') {
			result = this.add
				.text(x, y - 75, 'You Lose!', { fontSize: 55 })
				.setOrigin(0.5)
		} else {
			result = this.add
				.text(x, y - 75, 'You Win!', { fontSize: 55 })
				.setOrigin(0.5)
		}

		result.setData('sorted', true)
		result.setDepth(3000)
		const playAgain = this.add
			.text(250, 550, '< PLAY AGAIN >', {
				fontFamily: 'Grandstander',
				fontSize: '40px',
				color: '#B8D3FF',
				fontStyle: 'normal',
				shadow: { blur: 3, color: '#FFFFFF', fill: true },
			})
			.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
				this.bgm.stop()
				this.scene.start('game')
			})
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
				playAgain.setShadowBlur(3)
				playAgain.setShadowColor('#ffffff')
				playAgain.setShadowFill(true)
			})
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
				playAgain.setShadowBlur(0)
				playAgain.setShadowFill(false)
			})
			.setOrigin(0.5)

		playAgain.setData('sorted', true)
		playAgain.setDepth(3000)

		const quitButton = this.add
			.text(500, 550, '< QUIT >', {
				fontFamily: 'Grandstander',
				fontSize: '40px',
				color: '#FFC1C1',
				fontStyle: 'normal',
				shadow: { blur: 3, color: '#FFFFFF', fill: true },
			})
			.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
				this.bgm.stop()
				this.scene.start('preloader')
			})
			.setOrigin(0.5)
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
				quitButton.setShadowBlur(3)
				quitButton.setShadowColor('#ffffff')
				quitButton.setShadowFill(true)
			})
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
				quitButton.setShadowBlur(0)
				quitButton.setShadowFill(false)
			})

		quitButton.setData('sorted', true)
		quitButton.setDepth(3000)
	}

	handleCountdownFinished() {
		this.player.active = false
		this.player.setVelocity(0, 0)
		this.resultPage('lose')
	}

	handlePlayerBoxCollide(player, box) {
		const opened = box.getData('opened')
		if (opened) {
			return
		}

		if (this.activeBox) {
			return
		}

		this.activeBox = box

		this.activeBox.setFrame(9)
	}

	updateActiveBox() {
		if (!this.activeBox) {
			return
		}
		const dist = Phaser.Math.Distance.Between(
			this.player.x,
			this.player.y,
			this.activeBox.x,
			this.activeBox.y
		)

		if (dist < 64) {
			return
		}
		this.activeBox.setFrame(10)
		this.activeBox = undefined
	}

	openBox(box) {
		if (!box) {
			return
		}

		const itemType = box.getData('itemType')
		let item
		switch (itemType) {
			case 0:
				item = this.itemsGroup.get(box.x, box.y)
				item.setTexture('bear')
				break
			case 1:
				item = this.itemsGroup.get(box.x, box.y)
				item.setTexture('elephant')
				break
			case 2:
				item = this.itemsGroup.get(box.x, box.y)
				item.setTexture('chicken')
				break
			case 3:
				item = this.itemsGroup.get(box.x, box.y)
				item.setTexture('pig')
				break
			case 4:
				item = this.itemsGroup.get(box.x, box.y)
				item.setTexture('penguin')
				break
		}

		if (!item) {
			return
		}

		box.setData('opened', true)
		item.setData('sorted', true)
		item.setDepth(2000)

		item.scale = 0
		item.alpha = 0

		this.selectedBoxes.push({ box, item })

		this.tweens.add({
			targets: item,
			y: '-=50',
			alpha: 1,
			scale: 0.4,
			duration: 500,
			onComplete: () => {
				if (itemType === 0) {
					this.handleBearSelected()
				}
				if (this.selectedBoxes.length < 2) {
					return
				}
				this.checkForMatch()
			},
		})

		this.activeBox.setFrame(10)
		this.activeBox = undefined
	}

	checkForMatch() {
		const second = this.selectedBoxes.pop()
		const first = this.selectedBoxes.pop()

		if (first.item.texture !== second.item.texture) {
			first.box.setFrame(7)
			second.box.setFrame(7)
			this.tweens.add({
				targets: [first.item, second.item],
				y: '+=50',
				alpha: 0,
				scale: 0,
				duration: 300,
				delay: 500,
				onComplete: () => {
					first.box.setData('opened', false)
					second.box.setData('opened', false)
					first.box.setFrame(10)
					second.box.setFrame(10)
				},
			})
			return
		} else {
			this.matchesCount++

			if (this.matchesCount >= 4) {
				//game won
				this.player.active = false
				this.player.setVelocity(0, 0)
				this.countdown.stop()
			}

			this.time.delayedCall(500, () => {
				first.box.setFrame(8)
				second.box.setFrame(8)
				if (this.matchesCount >= 4) {
					//game won delayed
					this.resultPage('win')
				}
			})
		}
	}

	handleBearSelected() {
		const bear = this.selectedBoxes.pop()
		let first
		if (this.selectedBoxes.length === 1) {
			first = this.selectedBoxes.pop()
		}

		this.player.active = false

		bear.item.setTint(0xff0000)
		bear.box.setFrame(97)
		this.player.active = false
		this.player.setVelocity(0, 0)

		this.time.delayedCall(2000, () => {
			bear.item.setTint(0xffffff)
			bear.box.setFrame(10)

			this.tweens.add({
				targets: bear.item,
				y: '+=50',
				alpha: 0,
				scale: 0,
				duration: 300,
				delay: 500,
				onComplete: () => {
					this.player.active = true
					bear.box.setData('opened', false)
				},
			})

			if (first) {
				this.tweens.add({
					targets: first.item,
					y: '+=50',
					alpha: 0,
					scale: 0,
					duration: 300,
					delay: 500,
					onComplete: () => {
						first.box.setData('opened', false)
					},
				})
			}
		})
	}

	updatePlayer() {
		if (!this.player.active) {
			return
		}
		const speed = 200

		if (this.cursors.left.isDown) {
			this.player.setVelocity(-speed, 0)
			this.player.play('left-walk', true)
		} else if (this.cursors.right.isDown) {
			this.player.setVelocity(speed, 0)
			this.player.play('right-walk', true)
		} else if (this.cursors.up.isDown) {
			this.player.setVelocity(0, -speed)
			this.player.play('up-walk', true)
		} else if (this.cursors.down.isDown) {
			this.player.setVelocity(0, speed)
			this.player.play('down-walk', true)
		} else {
			this.player.setVelocity(0, 0)
			const key = this.player.anims.currentAnim.key
			const parts = key.split('-')
			const direction = parts[0]
			this.player.play(`${direction}-idle`)
		}

		const spaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors.space) // if the space bar was just pressed
		if (spaceJustPressed && this.activeBox) {
			this.openBox(this.activeBox)
			this.activeBox = undefined
		}
	}

	update() {
		this.updatePlayer()

		this.updateActiveBox()

		this.children.each((c) => {
			const child = c

			if (child.getData('sorted')) {
				return
			}

			child.setDepth(child.y)
		})

		this.countdown.update()
	}
}

export default Game
