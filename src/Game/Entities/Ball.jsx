export class Ball {
  constructor(x, y, radius, velocityX, velocityY, speed, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.speed = speed;
    this.initialSpeed = speed;
    this.color = color;
  }

  drawBall(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }

  drawHit(ctx, hitBallSize) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(
      this.x,
      this.y,
      hitBallSize / 2,
      hitBallSize / 4,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "WHITE";
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.restore();
  }

  moveBall() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  resetBall(width, height) {
    this.x = width / 2;
    this.y = height / 2;
    this.velocityX = -this.velocityX;
    this.speed = this.initialSpeed;
  }

  ballPlayerCollision(player) {
    return (
      player.x + 5 < this.x + this.radius &&
      player.y + 5 < this.y + this.radius &&
      player.x + 5 + player.width > this.x - this.radius &&
      player.y + 5 + player.height > this.y - this.radius
    );
  }

  ballTopAndBottomCollision(gameHeight, ctx, hitBallSize) {
    if (this.y - this.radius < 5 || this.y + this.radius > gameHeight - 5) {
      this.drawHit(ctx, hitBallSize);
      this.velocityY = -this.velocityY;
    }
  }
}
