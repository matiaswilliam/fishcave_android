import { Input } from "phaser";
import { getGameWidth, getGameHeight } from "../helpers";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  platforms;
  player;
  cursors;
  rocks;
  bombs;
  score = 0;
  scoreText;
  gameOver;
  constructor() {
    super(sceneConfig);
  }

  public preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("rock", "assets/rock.png");
    this.load.image("bomb", "assets/bomb.png");

    this.load.spritesheet("fish", "assets/fish.png", {
      frameWidth: 64,
      frameHeight: 44,
    });
  }

  public create() {

    this.add.image(0, 0, 'background').setOrigin(0);
    this.setUpRocks();

    this.scoreText = this.add.text(15, 100, "SCORE: 0", {
      fontSize: "32px",
      fill: "#fff",
    });
    this.setUpPlatforms();
    this.setUpPlayer();
    this.physics.add.collider(this.player, this.platforms);


    this.cursors = this.input.keyboard.createCursorKeys();

    // this.physics.add.collider(
    //   this.player,
    //   this.bombs,
    //   this.hitBomb,
    //   null,
    //   this
    // );
    this.input.mouse.capture = true;
    let player = this.player;

    this.input.on("pointerup", function (pointer) {
      if (pointer.leftButtonReleased()) {
        player.setVelocityY(-230);
      }
    });
  }
  public update() {
  }

  setUpPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(100, 35, "ground").setAngle(180);
    this.platforms.create(100, 765, "ground");
  }

  setUpPlayer() {
    this.player = this.physics.add.sprite(200, 250, "fish");
    // this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: "swim",
      frames: this.anims.generateFrameNumbers("fish", { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
    });
  }

  setUpRocks() {
    this.rocks = this.physics.add.group({
      key: "rock",
      repeat: 100,
      setXY: { x: 100, y: 650, stepX: 140 },
      gravityY: -200,
    });

    this.rocks.children.iterate((child) => {
      if (Math.floor(Math.random() * 2) + 1 === 2) {
        child.setAngle(180);
        child.setY(150);
      }
      child.setVelocityX(-200);
    });
  }

  collectStar(player, star) {
    this.score += 1;
    this.scoreText.setText("SCORE: " + this.score);
    // this.releaseBomp();
  }


  hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    this.gameOver = true;
  }
}
