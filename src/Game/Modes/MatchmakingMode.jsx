/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import ErrorConnection from "../components/ErrorConnecting";
import LiveGameMode from "./LiveGameMode";

const GameURL = "http://localhost:3000/game";
const socket = io(GameURL, {
  autoConnect: false,
  transports: ["websocket"],
});

export default function Matchmaking({ onLeaveMatchmaking }) {
  const socketRef = useRef(socket.connect());
  const [matchMakingStatus, setMatchMakingStatus] = useState("pending");
  const [opponent, setOpponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    socketRef.current.on("connect_error", (error) => {
      setError(error.message);
    });

    socketRef.current.emit("joinQueue");


    socketRef.current.on("foundMatch", (data) => {
      setMatchMakingStatus("foundMatch");
      setOpponent(data.opponent);
    });
  }, []);

  if (error) {
    socketRef.current.disconnect();
    return <ErrorConnection></ErrorConnection>;
  }

  if (matchMakingStatus === "foundMatch") {
    return <LiveGameMode socketRef={socketRef}></LiveGameMode>;
  }

  const leaveMatchMaking = () => {
    socketRef.current.emit("leaveQueue");
    socketRef.current.disconnect();
    onLeaveMatchmaking();
  };

  return (
    <div>
      {opponent}
      <h1>
        {matchMakingStatus === "pending"
          ? "Finding Random Player"
          : "Match Found"}
      </h1>
      <button onClick={leaveMatchMaking}>Leave</button>
    </div>
  );
}
