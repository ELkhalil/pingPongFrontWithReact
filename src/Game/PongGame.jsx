import { useState } from "react";
import BotMode from "./Modes/BotMode";
import Matchmaking from "./Modes/Matchmaking";

export default function PongGame() {
  const [mode, setMode] = useState(null);

  function vsBotHandler() {
    setMode("training");
  }

  function vsRandomHandler() {
    setMode("matchmaking");
  }

  if (mode && mode == "training") {
    return <BotMode></BotMode>;
  }

  if (mode && mode == "matchmaking") {
    return <Matchmaking></Matchmaking>;
  }

  return (
    <div>
      {mode == "training"}
      <h1 id="heading">PongGame</h1>
      <button onClick={vsBotHandler}>Vs Bot</button>
      <button onClick={vsRandomHandler}>Vs Random</button>
    </div>
  );
}
