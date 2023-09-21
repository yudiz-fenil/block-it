
window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 1080,
		height: 1920,
		type: Phaser.AUTO,
		transparent: true,
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
		},
		audio: {
			disableWebAudio: false
		},
		dom: {
			createContainer: true
		},
		physics: {
			default: 'arcade',
			arcade: {
				debug: false
			}
		}
	});

	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {

		this.load.pack("pack", "assets/preload-asset-pack.json");

		this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Preload"));
	}
}