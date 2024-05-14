export class Player {
  constructor(x, y, width, height, score, color, fractionOfHeight) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.score = score;
    this.color = color;
    this.fractionOfHeight = fractionOfHeight;
  }

  drawPlayer(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  movePlayer(gameHeight, direction) {
    const moveSpeed = this.fractionOfHeight * gameHeight;

    if (direction === "up") {
      if (this.y - moveSpeed < 0) {
        this.y = 0;
      } else {
        this.y -= moveSpeed;
      }
    } else if (direction === "down") {
      if (this.y + this.height + moveSpeed > gameHeight) {
        this.y = gameHeight - this.height;
      } else {
        this.y += moveSpeed;
      }
    }
  }
}
