/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Game } from "../Engine/Game";
import style from "../Styles/counterText.module.css";

export default function BotMode({ onLeaveBotGame }) {
  const [timerValue, setTimerValue] = useState(5);
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const game = new Game(canvas.width, canvas.height, 60, 2, ctx);
    gameRef.current = game;
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
      timerInterval = setInterval(() => {
        if (timerValue === 1) {
          clearInterval(timerInterval);
          game.startGame(ctx);
          if (counterRef) {
            counterRef.current.innerText = "";
          }
        } else {
          setTimerValue(timerValue - 1);
        }
      }, 1000);
    }

    return () => {
      document.removeEventListener("keydown", () => {});
      clearInterval(timerInterval);
      game.endGame();
    };
  }, [timerValue]);

  const leaveBotGame = () => {
    onLeaveBotGame();
  };

  return (
    <div>
      <h1>Welcome to the Bot Mode </h1>
      <canvas ref={canvasRef} id="canvas" height="500px" width="800px"></canvas>
      <p ref={counterRef} className={style.counterText}>
        {timerValue}
      </p>
      <button onClick={leaveBotGame}>Back</button>
    </div>
  );
}
