import { useEffect, useRef } from "react";
import { Game } from "../Engine/Game";

export default function BotMode() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const game = new Game(canvas.width, canvas.height, 60, 2, ctx);
    let timerInterval = null;

    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowUp":
          game.player.movePlayer(game.height, "up");
          break;
        case "ArrowDown":
          game.player.movePlayer(game.height, "down");
          break;
      }
    });

    startTimer();

    function startTimer() {
      let timerValue = 5;
      timerInterval = setInterval(() => {
        console.log(timerValue);
        if (timerValue === 0) {
          clearInterval(timerInterval);
          game.startGame(ctx);
        } else {
          timerValue--;
        }
      }, 1000);
    }

    return () => {
      document.removeEventListener("keydown", () => {});
    };
  }, []);

  return (
    <div>
      <h1>Welcome to the Bot Mode </h1>
      <canvas ref={canvasRef} id="canvas" height="500px" width="800px"></canvas>
    </div>
  );
}
