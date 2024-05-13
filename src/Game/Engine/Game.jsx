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
    this.isPlaying = false;
    this.initializePlayers();
    this.ballHitSound = null;
    this.scoreSound = null;
    this.gameOverSound = null;
    this.preLoadSounds();
    this.bgImage = null;
    this.skinImage = null;
    this.preLoadImages();
    this.sparkX = null;
    this.sparkY = null;
  }

  initializePlayers() {
    this.player = new Player(
      0,
      (this.height - 100) / 2,
      10,
      100,
      0,
      "WHITE",
      10
    );
    this.computer = new Player(
      this.width - 10,
      (this.height - 100) / 2,
      10,
      100,
      0,
      "WHITE",
      10
    );
    this.ball = new Ball(this.width / 2, this.height / 2, 10, 5, 5, 7, "WHITE");
    this.preLoadSounds();
  }

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

  drawNet(ctx) {
    for (let i = 0; i <= this.height; i += 15) {
      ctx.fillStyle = "WHITE";
      ctx.fillRect((this.width - 2) / 2, 0 + i, 2, 10);
    }
  }

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

  drawScores(ctx) {
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(this.player.score, this.width / 4, this.height / 5);
    ctx.fillText(this.computer.score, (3 * this.width) / 4, this.height / 5);
  }

  render(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    if (this.bgImage) {
      ctx.drawImage(this.bgImage, 0, 0, this.width, this.height);
    }
    this.drawScores(ctx);
    this.drawNet(ctx);
    this.drawPlayerShadow(ctx);
    // this.player.drawPlayer(ctx);

    if (this.skinImage) {
      ctx.drawImage(
        this.skinImage,
        this.player.x,
        this.player.y,
        this.player.width,
        this.player.height
      );
    }
    // this.computer.drawPlayer(ctx);
    if (this.skinImage) {
      ctx.drawImage(
        this.skinImage,
        this.computer.x,
        this.computer.y,
        this.computer.width,
        this.computer.height
      );
    }
    this.drawSpark(ctx);
    this.drawTrail(ctx);
    this.ball.drawBall(ctx);
  }

  autoAiControl() {
    this.computer.y +=
      (this.ball.y - (this.computer.y + this.computer.height / 2)) * 0.1;
    if (this.computer.y < 0) {
      this.computer.y = 0;
    } else if (this.computer.y + this.computer.height > this.height) {
      this.computer.y = this.height - this.computer.height;
    }
  }

  setSparkPosition(x, y) {
    this.sparkX = x;
    this.sparkY = y;
  }

  drawFlash(ctx, x, y) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 20, 5, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.restore();
  }

  drawSpark(ctx) {
    if (this.sparkX && this.sparkY) {
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(this.sparkX, this.sparkY, 30, 10, Math.PI * 2);
      ctx.fill();
      this.sparkX = null;
      this.sparkY = null;
    }
  }

  drawPlayerShadow(ctx) {
    // Set shadow color and opacity
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

    // Draw shadow slightly offset from the player
    const shadowOffsetX = 5;
    const shadowOffsetY = 5;
    ctx.fillRect(
      this.player.x + shadowOffsetX,
      this.player.y + shadowOffsetY,
      this.player.width,
      this.player.height
    );
  }

  drawTrail(ctx) {
    // Set the number of trail segments
    const numSegments = 7;
    // Set the opacity of each trail segment
    const opacityStep = 0.1;

    // Calculate the opacity for each segment
    let opacity = 0.4;

    const opacityDelta = opacityStep;

    // Draw each segment of the trail
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

  update() {
    /* Scoring Logic */
    this.updateScores();

    /* ball velocity and move */
    this.ball.moveBall();

    /* let's make the right player follow the ball */
    this.autoAiControl();

    /* Ball Collision with the top and bottom of the world */
    this.ball.ballTopAndBottomCollision(this.height);

    /* we check if the paddle hit the user or the com paddle */
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
      // this.setSparkPosition(this.ball.x, this.ball.y);
      this.drawFlash(this.ctx, this.ball.x, this.ball.y);
    }
  }

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

  cleanupImages() {
    // Remove src attribute to release resources
    if (this.bgImage) {
      this.bgImage.src = "";
    }
    if (this.skinImage) {
      this.skinImage.src = "";
    }
  }

  endGame() {
    if (this.loop) {
      clearInterval(this.loop);
    }
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
}
