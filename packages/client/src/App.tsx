// ABOUTME: Main React application component
// ABOUTME: Integrates WebSocket, game state, and PixiJS canvas

import { useEffect } from "react";
import { getVersion } from "@end-of-line/shared";
import { GameCanvas } from "./canvas/index.js";
import { useGameStore } from "./store/index.js";
import { initWebSocket, getWebSocket } from "./websocket/index.js";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3001/ws";

export default function App() {
  const connectionState = useGameStore((s) => s.connectionState);
  const setConnectionState = useGameStore((s) => s.setConnectionState);
  const handleServerMessage = useGameStore((s) => s.handleServerMessage);
  const players = useGameStore((s) => s.players);
  const gameId = useGameStore((s) => s.gameId);
  const setGameId = useGameStore((s) => s.setGameId);

  useEffect(() => {
    const ws = initWebSocket({
      url: WS_URL,
      onMessage: (message) => {
        // Handle GAME_CREATED specially to store game ID
        if (message.type === "GAME_CREATED") {
          setGameId(message.gameId);
        }
        handleServerMessage(message);
      },
      onStateChange: setConnectionState,
    });

    ws.connect();

    return () => {
      ws.disconnect();
    };
  }, [handleServerMessage, setConnectionState, setGameId]);

  const handleJoinGame = () => {
    const ws = getWebSocket();
    if (ws) {
      ws.send({ type: "JOIN_GAME" });
    }
  };

  const handleJoinExisting = () => {
    const ws = getWebSocket();
    const id = prompt("Enter game ID:");
    if (ws && id) {
      ws.send({ type: "JOIN_GAME", gameId: id });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        fontFamily: "monospace",
        backgroundColor: "#0a0a0f",
        color: "#00ff88",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>End of Line</h1>
        <p style={{ color: "#666", margin: "5px 0" }}>
          v{getVersion()} | {connectionState}
        </p>
      </header>

      {gameId && (
        <p style={{ color: "#888", fontSize: "12px" }}>Game ID: {gameId}</p>
      )}

      <GameCanvas width={800} height={600} />

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          type="button"
          onClick={handleJoinGame}
          disabled={connectionState !== "connected"}
          style={{
            padding: "10px 20px",
            fontFamily: "monospace",
            backgroundColor:
              connectionState === "connected" ? "#00ff88" : "#333",
            color: connectionState === "connected" ? "#000" : "#666",
            border: "none",
            cursor: connectionState === "connected" ? "pointer" : "not-allowed",
          }}
        >
          Create Game
        </button>
        <button
          type="button"
          onClick={handleJoinExisting}
          disabled={connectionState !== "connected"}
          style={{
            padding: "10px 20px",
            fontFamily: "monospace",
            backgroundColor:
              connectionState === "connected" ? "#00ff88" : "#333",
            color: connectionState === "connected" ? "#000" : "#666",
            border: "none",
            cursor: connectionState === "connected" ? "pointer" : "not-allowed",
          }}
        >
          Join Game
        </button>
      </div>

      {players.length > 0 && (
        <div style={{ marginTop: "20px", color: "#888" }}>
          <h3>Players:</h3>
          <ul>
            {players.map((p) => (
              <li key={p.id}>
                {p.name} ({p.factionId}) - Credits: {p.credits}, Actions:{" "}
                {p.actions}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
