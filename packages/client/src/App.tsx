// ABOUTME: Main React application component
// ABOUTME: Playable game UI with turn-based territory control

import { useEffect, useState } from "react";
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
  const territories = useGameStore((s) => s.territories);
  const gameId = useGameStore((s) => s.gameId);
  const setGameId = useGameStore((s) => s.setGameId);
  const playerId = useGameStore((s) => s.playerId);
  const setPlayerId = useGameStore((s) => s.setPlayerId);

  const [myRole, setMyRole] = useState<"CORP" | "RUNNER" | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null);
  const [joinGameId, setJoinGameId] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);

  // Find current player and whose turn it is
  const myPlayer = players.find((p) => p.factionId === (myRole === "CORP" ? "corp" : "runner"));
  const isMyTurn = myPlayer && players.length === 2 && players[0]?.id === myPlayer.id;

  useEffect(() => {
    const ws = initWebSocket({
      url: WS_URL,
      onMessage: (message) => {
        if (message.type === "GAME_CREATED") {
          setGameId(message.gameId);
          setMyRole("CORP");
          setStatusMessage("Game created! Share ID with friend to join.");
        } else if (message.type === "STATE_DELTA" && message.delta.players) {
          // Determine role from player position
          const playerList = message.delta.players as Array<{ id: string; factionId: string }>;
          if (playerList.length === 2 && !myRole) {
            setMyRole("RUNNER");
            setStatusMessage("Joined as Runner!");
          }
        } else if (message.type === "ACTION_REJECTED") {
          setStatusMessage(`❌ ${message.reason}`);
        } else if (message.type === "SCENARIO_ENDED") {
          setStatusMessage(
            message.outcome === "RUNNER_WIN"
              ? "🏃 Run successful! Corp influence reduced."
              : "🏢 Run failed! Corp influence increased."
          );
        }
        handleServerMessage(message);
      },
      onStateChange: setConnectionState,
    });

    ws.connect();

    return () => {
      ws.disconnect();
    };
  }, [handleServerMessage, setConnectionState, setGameId, setPlayerId, myRole]);

  const handleCreateGame = () => {
    const ws = getWebSocket();
    if (ws) {
      ws.send({ type: "JOIN_GAME" });
    }
  };

  const handleJoinGame = () => {
    if (!showJoinInput) {
      setShowJoinInput(true);
      return;
    }
    const ws = getWebSocket();
    const id = joinGameId.trim();
    if (ws && id) {
      ws.send({ type: "JOIN_GAME", gameId: id });
      setShowJoinInput(false);
      setJoinGameId("");
    }
  };

  const handleTerritoryClick = (territoryId: string) => {
    if (!isMyTurn || !myPlayer || myPlayer.actions <= 0) {
      setStatusMessage("Not your turn or no actions left");
      return;
    }

    const territory = territories.find((t) => t.id === territoryId);
    if (!territory) return;

    const ws = getWebSocket();
    if (!ws) return;

    if (myRole === "CORP") {
      // Corp places influence (+10)
      ws.send({ type: "PLACE_INFLUENCE", territoryId, amount: 10 });
      setStatusMessage(`Placing influence on ${territory.name}`);
    } else {
      // Runner can reduce influence or run if Corp-controlled
      if (territory.corporateInfluence >= 60) {
        ws.send({ type: "RUN_TERRITORY", territoryId });
        setStatusMessage(`Running ${territory.name}...`);
      } else {
        ws.send({ type: "PLACE_INFLUENCE", territoryId, amount: 10 });
        setStatusMessage(`Disrupting ${territory.name}`);
      }
    }
    setSelectedTerritory(territoryId);
  };

  const handleEndTurn = () => {
    const ws = getWebSocket();
    if (ws) {
      ws.send({ type: "END_TURN" });
      setStatusMessage("Turn ended");
    }
  };

  const inGame = players.length > 0;
  const gameReady = players.length === 2;

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
      <header style={{ marginBottom: "10px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>End of Line</h1>
        <p style={{ color: "#666", margin: "5px 0", fontSize: "12px" }}>
          v{getVersion()} | {connectionState}
          {myRole && ` | You: ${myRole}`}
        </p>
      </header>

      {/* Game ID display */}
      {gameId && (
        <div style={{
          backgroundColor: "#1a1a2e",
          padding: "8px 16px",
          borderRadius: "4px",
          marginBottom: "10px"
        }}>
          <span style={{ color: "#888" }}>Game ID: </span>
          <span style={{ color: "#00ff88", fontWeight: "bold" }}>{gameId}</span>
        </div>
      )}

      {/* Status message */}
      {statusMessage && (
        <div style={{
          color: "#ffaa00",
          marginBottom: "10px",
          padding: "8px",
          backgroundColor: "#2a2a1e",
          borderRadius: "4px"
        }}>
          {statusMessage}
        </div>
      )}

      {/* Turn indicator */}
      {gameReady && (
        <div style={{
          display: "flex",
          gap: "20px",
          marginBottom: "10px",
          padding: "10px",
          backgroundColor: "#1a1a2e",
          borderRadius: "4px"
        }}>
          {players.map((p, idx) => (
            <div
              key={p.id}
              style={{
                padding: "8px 16px",
                backgroundColor: idx === 0 ? "#002244" : "#220022",
                border: isMyTurn && p.id === myPlayer?.id ? "2px solid #00ff88" : "2px solid transparent",
                borderRadius: "4px"
              }}
            >
              <div style={{ fontWeight: "bold" }}>
                {p.factionId === "corp" ? "🏢 Corp" : "🏃 Runner"}
                {p.factionId === (myRole === "CORP" ? "corp" : "runner") && " (You)"}
              </div>
              <div style={{ fontSize: "12px", color: "#888" }}>
                💰 {p.credits} | ⚡ {p.actions} actions
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Game canvas */}
      <GameCanvas
        width={800}
        height={500}
        onTerritoryClick={handleTerritoryClick}
      />

      {/* Game controls */}
      <div style={{ marginTop: "15px", display: "flex", gap: "10px", alignItems: "center" }}>
        {!inGame ? (
          <>
            {!showJoinInput && (
              <button
                type="button"
                onClick={handleCreateGame}
                disabled={connectionState !== "connected"}
                style={buttonStyle(connectionState === "connected")}
              >
                Create Game
              </button>
            )}
            {showJoinInput && (
              <input
                type="text"
                value={joinGameId}
                onChange={(e) => setJoinGameId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoinGame()}
                placeholder="Enter Game ID"
                style={{
                  padding: "12px",
                  fontFamily: "monospace",
                  fontSize: "14px",
                  backgroundColor: "#1a1a2e",
                  color: "#00ff88",
                  border: "2px solid #00ff88",
                  borderRadius: "4px",
                  width: "150px",
                }}
                autoFocus
              />
            )}
            <button
              type="button"
              onClick={handleJoinGame}
              disabled={connectionState !== "connected"}
              style={buttonStyle(connectionState === "connected")}
            >
              {showJoinInput ? "Join" : "Join Game"}
            </button>
            {showJoinInput && (
              <button
                type="button"
                onClick={() => { setShowJoinInput(false); setJoinGameId(""); }}
                style={buttonStyle(true)}
              >
                Cancel
              </button>
            )}
          </>
        ) : gameReady ? (
          <button
            type="button"
            onClick={handleEndTurn}
            disabled={!isMyTurn}
            style={buttonStyle(isMyTurn ?? false)}
          >
            End Turn
          </button>
        ) : (
          <div style={{ color: "#888" }}>Waiting for opponent to join...</div>
        )}
      </div>

      {/* Instructions */}
      {gameReady && (
        <div style={{
          marginTop: "15px",
          padding: "10px",
          backgroundColor: "#1a1a2e",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#888",
          maxWidth: "600px",
          textAlign: "center"
        }}>
          <strong style={{ color: "#00ff88" }}>How to play:</strong>{" "}
          {myRole === "CORP"
            ? "Click territories to increase Corp influence (+10). Control territories with 60%+ influence."
            : "Click neutral/runner territories to reduce Corp influence. Click blue (Corp-controlled) territories to RUN them!"}
        </div>
      )}
    </div>
  );
}

function buttonStyle(enabled: boolean): React.CSSProperties {
  return {
    padding: "12px 24px",
    fontFamily: "monospace",
    fontSize: "14px",
    backgroundColor: enabled ? "#00ff88" : "#333",
    color: enabled ? "#000" : "#666",
    border: "none",
    borderRadius: "4px",
    cursor: enabled ? "pointer" : "not-allowed",
    fontWeight: "bold",
  };
}
