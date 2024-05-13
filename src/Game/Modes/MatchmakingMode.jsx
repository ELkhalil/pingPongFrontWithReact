// import { useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";

// const GameURL = "http://localhost:3000/game";
// const socket = io(GameURL, {
//   autoConnect: false,
//   transports: ["websocket"],
// });

// export default function Matchmaking() {
//   const navigate = useNavigate();
//   const socketRef = useRef(socket.connect());

//   const leaveMatchMaking = () => {
//     socketRef.current.disconnect();
//     navigate("/");
//   };

//   return (
//     <div>
//       <h1>Finding Random Player</h1>
//       <button onClick={leaveMatchMaking}>Leave</button>
//     </div>
//   );
// }

import { useRef } from "react";
import { io } from "socket.io-client";

const GameURL = "http://localhost:3000/game";
const socket = io(GameURL, {
  autoConnect: false,
  transports: ["websocket"],
});

export default function Matchmaking({ onLeaveMatchmaking }) {
  const socketRef = useRef(socket.connect());

  const leaveMatchMaking = () => {
    socketRef.current.disconnect();
    onLeaveMatchmaking();
  };

  return (
    <div>
      <h1>Finding Random Player</h1>
      <button onClick={leaveMatchMaking}>Leave</button>
    </div>
  );
}
