import { Ball } from "../Entities/Ball";
import { Player } from "../Entities/Player";

export class Game {
  constructor(width, height, framePerSeconds, winTarget, ctx) {
    this.width = width;
    this.height = height;
    this.framePerSeconds = framePerSeconds;
    this.loop = null;
    this.ctx = ctx;
    this.target = winTarget;
    this.player = null;
    this.computer = null;
    this.ball = null;

    /* Game General Settings */
    this.defaultColor = "WHITE";

    /* Players Settings */
    this.playerWidthPercentage = 5;
    this.playerHeightPercentage = 20;
    this.fractionForSpeed = 0.05;

    /* Ball Settings */
    this.ballSizePercentage = 2.5;
    this.ballSpeed = 7;
    this.ballVelocity = 5;
    this.ballSize =
      Math.min(this.width, this.height) * (this.ballSizePercentage / 100);

    /* Net Settings */
    this.netWidth = Math.ceil(this.width * 0.006);
    this.netGap = Math.ceil(this.height * 0.04);

    /* Scores Settings */
    this.font = "75px fantasy";

    /* Sounds Settings */
    this.ballHitSound = null;
    this.scoreSound = null;
    this.gameOverSound = null;

    /* Skins And Backgrounds */
    this.bgImage = null;
    this.skinImage = null;

    /* Effects Settings */
    this.hitBallColor = "WHITE";
    this.hitBallSizeX = 30;
    this.hitBallSizeY = 10;

    /* Init Data*/
    this.initGameEntities();
    this.preLoadSounds();
    this.preLoadImages();
  }

  /* Game Init Methods */
  initGameEntities() {
    const playersWidth = (this.width * this.playerWidthPercentage) / 100;
    const playersHeight = (this.height * this.playerHeightPercentage) / 100;

    this.player = new Player(
      0,
      (this.height - playersHeight) / 2,
      playersWidth,
      playersHeight,
      0,
      this.defaultColor,
      this.fractionForSpeed
    );
    this.computer = new Player(
      this.width - playersWidth,
      (this.height - playersHeight) / 2,
      playersWidth,
      playersHeight,
      0,
      this.defaultColor,
      this.fractionForSpeed
    );
    this.ball = new Ball(
      this.width / 2,
      this.height / 2,
      this.ballSize,
      this.ballVelocity,
      this.ballVelocity,
      this.ballSpeed,
      this.defaultColor
    );
    this.preLoadSounds();
  }

  /* Drawing Methods */
  drawScores(ctx) {
    ctx.fillStyle = this.defaultColor;
    ctx.font = this.font;
    ctx.fillText(this.player.score, this.width / 4, this.height / 5);
    ctx.fillText(this.computer.score, (3 * this.width) / 4, this.height / 5);
  }
  drawNet(ctx) {
    ctx.fillStyle = this.netColor;
    ctx.beginPath();
    for (let y = this.netGap; y < this.height; y += this.netGap * 2) {
      ctx.rect((this.width - this.netWidth) / 2, y, this.netWidth, this.netGap);
    }
    ctx.fill();
  }
  drawFlash(ctx, x, y) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      x + this.ball.radius,
      y + this.ball.radius,
      this.hitBallSizeX,
      this.hitBallSizeY,
      Math.PI * 2
    );
    ctx.fillStyle = this.hitBallColor;
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.restore();
  }
  drawPlayerShadow(ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    const shadowOffsetX = 3;
    const shadowOffsetY = 5;
    ctx.fillRect(
      this.player.x + shadowOffsetX,
      this.player.y + shadowOffsetY,
      this.player.width,
      this.player.height
    );
  }
  drawBallTrail(ctx) {
    const numSegments = 6;
    const opacityStep = 0.1;
    let opacity = 0.4;
    const opacityDelta = opacityStep;
    for (let i = 0; i < numSegments; i++) {
      ctx.beginPath();
      ctx.arc(
        this.ball.x - this.ball.velocityX * i,
        this.ball.y - this.ball.velocityY * i,
        this.ball.radius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
      opacity -= opacityDelta;
    }
  }

  /* Loading Images/Sounds For The Game */
  preLoadImages() {
    this.bgImage = new Image();
    this.skinImage = new Image();
    this.bgImage.src = "/assets/game/backgrounds/forest.png";
    this.skinImage.src = "/assets/game/skins/ninja.png";
  }
  preLoadSounds() {
    this.ballHitSound = new Audio("/sounds/hitBall.mp3");
    this.scoreSound = new Audio("/sounds/scoreSound.mp3");
    this.gameOverSound = new Audio("/sounds/gameOverSound.mp3");
  }

  /* On Going Game Settings */
  updateScores() {
    if (this.ball.x - this.ball.radius < 0) {
      this.computer.score++;
      if (this.scoreSound) {
        this.scoreSound.play();
      }
      if (this.computer.score >= this.target) {
        this.winner = "You Lost";
        if (this.gameOverSound) {
          this.gameOverSound.play();
        }
        this.endGame();
      }
      this.ball.resetBall(this.width, this.height);
    } else if (this.ball.x + this.ball.radius > this.width) {
      if (this.scoreSound) {
        this.scoreSound.play();
      }
      this.player.score++;
      if (this.player.score >= this.target) {
        this.winner = "You Are The Winner";
        if (this.gameOverSound) {
          this.gameOverSound.play();
        }
        this.endGame();
      }
      this.ball.resetBall(this.width, this.height);
    }
  }

  /* Control Bot  */
  botControlOn() {
    this.computer.y +=
      (this.ball.y - (this.computer.y + this.computer.height / 2)) * 0.1;
    if (this.computer.y < 0) {
      this.computer.y = 0;
    } else if (this.computer.y + this.computer.height > this.height) {
      this.computer.y = this.height - this.computer.height;
    }
  }

  /* Game Control */
  startGame(ctx) {
    if (!ctx) {
      return;
    }
    this.ctx = ctx;
    this.loop = setInterval(() => {
      this.render(this.ctx);
      this.update();
    }, 1000 / this.framePerSeconds);
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    if (this.bgImage) {
      ctx.drawImage(this.bgImage, 0, 0, this.width, this.height);
    } else {
      ctx.fillStyle = "BLACK";
      ctx.fillRect(0, 0, this.width, this.height);
    }
    this.drawScores(ctx);
    this.drawNet(ctx);
    this.drawPlayerShadow(ctx);
    if (this.skinImage) {
      ctx.drawImage(
        this.skinImage,
        this.player.x,
        this.player.y,
        this.player.width,
        this.player.height
      );
      ctx.drawImage(
        this.skinImage,
        this.computer.x,
        this.computer.y,
        this.computer.width,
        this.computer.height
      );
    } else {
      this.player.drawPlayer(ctx);
      this.computer.drawPlayer(ctx);
    }
    this.drawBallTrail(ctx);
    this.ball.drawBall(ctx);
  }

  update() {
    this.updateScores();
    this.ball.ballTopAndBottomCollision(this.height);
    this.ball.moveBall();
    this.botControlOn();
    let player =
      this.ball.x + this.ball.radius < this.width / 2
        ? this.player
        : this.computer;
    if (this.ball.ballPlayerCollision(player)) {
      if (this.ballHitSound && this.ballHitSound.readyState === 4) {
        this.ballHitSound.pause();
        this.ballHitSound.currentTime = 0;
        this.ballHitSound.play();
      }
      let collidePoint = this.ball.y - (player.y + player.height / 2);
      collidePoint = collidePoint / (player.height / 2);
      let angleRad = (Math.PI / 4) * collidePoint;
      let direction = this.ball.x + this.ball.radius < this.width / 2 ? 1 : -1;
      this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
      this.ball.velocityY = this.ball.speed * Math.sin(angleRad);
      this.ball.speed += 0.1;
      this.drawFlash(this.ctx, this.ball.x, this.ball.y);
    }
  }

  endGame() {
    if (this.loop) {
      clearInterval(this.loop);
    }
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    // TODO: still need to clean everything before leaving
  }

  /* CleanUp Methods */
  cleanupImages() {
    if (this.bgImage) {
      this.bgImage.src = "";
    }
    if (this.skinImage) {
      this.skinImage.src = "";
    }
  }
  cleanupSounds() {
    if (this.ballHitSound) {
      this.ballHitSound.pause();
      this.ballHitSound.currentTime = 0;
    }
    if (this.scoreSound) {
      this.scoreSound.pause();
      this.scoreSound.currentTime = 0;
    }
    if (this.gameOverSound) {
      this.gameOverSound.pause();
      this.gameOverSound.currentTime = 0;
    }
  }
}
