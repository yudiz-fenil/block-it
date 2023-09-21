
// You can write more code here
let gameOptions = {
	wallDuration: 100,
	ballStartSpeed: 800,
	ballSpeedIncrease: 20,
	localStorageName: "blockitscore",
}

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// txt_score
		const txt_score = this.add.text(540, 960, "", {});
		txt_score.setOrigin(0.5, 0.5);
		txt_score.alpha = 0.6;
		txt_score.alphaTopLeft = 0.6;
		txt_score.alphaTopRight = 0.6;
		txt_score.alphaBottomLeft = 0.6;
		txt_score.alphaBottomRight = 0.6;
		txt_score.text = "0";
		txt_score.setStyle({ "align": "center", "fontFamily": "Verdana", "fontSize": "600px", "fontStyle": "bold" });

		// txt_high_score
		const txt_high_score = this.add.text(540, 74, "", {});
		txt_high_score.setOrigin(0.5, 0.5);
		txt_high_score.text = "High Score : 0";
		txt_high_score.setStyle({ "align": "center", "fontFamily": "Verdana", "fontSize": "40px", "fontStyle": "bold" });

		this.txt_score = txt_score;
		this.txt_high_score = txt_high_score;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Text} */
	txt_score;
	/** @type {Phaser.GameObjects.Text} */
	txt_high_score;

	/* START-USER-CODE */

	// Write more your code here
	changeBackgroundColor = () => {
		document.body.style.backgroundColor = this.aColors[this.nCurrentColorIndex];
		this.nCurrentColorIndex++;
		if (this.nCurrentColorIndex >= this.aColors.length) {
			this.nCurrentColorIndex = 0;
		}
	}
	updateScore = () => {
		this.score++;
		this.txt_score.setText(this.score);
	}
	showBallParticles = () => {
		const emitter = this.particle.createEmitter({
			// speed: 100,
			scale: { start: 6, end: 0 },
			frequency: 100,
			lifespan: 4000,
			quantity: 1,
			blendMode: "NORMAL",
			alpha: { start: 1, end: 0, ease: 'Power2' }
		});
		emitter.startFollow(this.theBall);
	}
	create() {

		this.editorCreate();
		this.nCurrentColorIndex = 0;
		this.score = 0;
		this.aColors = ["#c6044d", "#690cca", "#c80290", "#c6044d", "#ca970f"];
		this.changeBackgroundColor();
		this.gameOver = false;
		this.canActivateWall = true;
		this.topScore = localStorage.getItem(gameOptions.localStorageName) == null ? 0 : localStorage.getItem(gameOptions.localStorageName);
		this.txt_high_score.setText("Best Score : " + this.topScore);
		this.particle = this.add.particles('snow');

		this.ballSpeed = gameOptions.ballStartSpeed;
		this.wallGroup = this.physics.add.group();

		this.theBall = this.physics.add.image(this.game.config.width / 2, this.game.config.height * 4 / 5, "ball");
		this.theBall.body.setCircle(64)
		this.theBall.setBounce(1);

		this.createWall(32, this.game.config.height / 2, 32, this.game.config.height, "wall-v"); // Left wall
		this.createWall(this.game.config.width - 32, this.game.config.height / 2, 32, this.game.config.height, "wall-v"); // Right wall
		this.createWall(this.game.config.width / 2, 32, this.game.config.width - 32, 32, "wall-h"); // Top wall
		this.lowerWall = this.createWall(this.game.config.width / 2, this.game.config.height - 32, this.game.config.width - 32, 32, "wall");

		this.physics.add.collider(this.theBall, this.wallGroup, (ball, wall) => {
			this.canActivateWall = true;
			if (wall.x == this.lowerWall.x && wall.y == this.lowerWall.y) {
				this.ballSpeed += gameOptions.ballSpeedIncrease;
				let ballVelocity = this.physics.velocityFromAngle(Phaser.Math.Between(220, 320), this.ballSpeed);
				this.theBall.setVelocity(ballVelocity.x, ballVelocity.y);
				this.changeBackgroundColor();
				this.updateScore();
			}
		}, null, this);
		this.input.on("pointerdown", this.activateWall, this);
	}
	createWall(posX, posY, width, height, texture) {
		let wall = this.physics.add.image(posX, posY, texture);
		this.wallGroup.add(wall);
		wall.setImmovable();
		return wall;
	}
	activateWall() {
		if (this.theBall.body.speed == 0) {
			this.showBallParticles();
			let ballVelocity = this.physics.velocityFromAngle(Phaser.Math.Between(220, 320), this.ballSpeed)
			this.theBall.setVelocity(ballVelocity.x, ballVelocity.y);
			this.lowerWall.alpha = 0.1;
			this.lowerWall.body.checkCollision.none = true;
			return;
		}
		if (this.canActivateWall) {
			this.canActivateWall = false;
			this.lowerWall.alpha = 1;
			this.lowerWall.body.checkCollision.none = false;
			let wallEvent = this.time.addEvent({
				delay: gameOptions.wallDuration,
				callbackScope: this,
				callback: function () {
					this.lowerWall.alpha = 0.1;
					this.lowerWall.body.checkCollision.none = true;
				}
			});
		}
	}
	update() {
		if ((this.theBall.y > this.game.config.height || this.theBall.y < 0) && !this.gameOver) {
			this.gameOver = true;
			this.cameras.main.shake(800, 0.05);
			this.time.addEvent({
				delay: 800,
				callbackScope: this,
				callback: () => {
					this.scene.start("Level");
					localStorage.setItem(gameOptions.localStorageName, Math.max(this.score, this.topScore));
				}
			});
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
