import { useState } from "react";
import BotMode from "./Modes/BotMode";
import Matchmaking from "./Modes/MatchmakingMode";

export default function PongGame() {
  const [mode, setMode] = useState(null);

  function vsBotHandler() {
    setMode("training");
  }

  function vsRandomHandler() {
    setMode("matchmaking");
  }

  function leave() {
    setMode(null);
  }

  if (mode && mode === "training") {
    return <BotMode onLeaveBotGame={leave} />;
  }

  if (mode && mode === "matchmaking") {
    return <Matchmaking onLeaveMatchmaking={leave} />;
  }

  return (
    <div>
      <h1 id="heading">PongGame</h1>
      <button onClick={vsBotHandler}>Vs Bot</button>
      <button onClick={vsRandomHandler}>Vs Random</button>
    </div>
  );
}
