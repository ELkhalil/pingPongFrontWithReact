/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";

export default function LiveGameMode({ socketRef }) {
  const socket = useRef(socketRef.current);

  useEffect(() => {
    socket.current.on("connect_error", (error) => {
      console.log(error);
    });

    socket.current.emit("let's go", {
      userName: "abdo",
    });

    socket.current.on("happyForYou", (data) => {
      console.log(data.testLive);
    });
  }, []);
  return <h1>Welcome to the Live Game mode</h1>;
}
