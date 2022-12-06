import React, { useState } from "react";
import GameScreen from "../components/GameScreen";
import StartScreen from "../components/StartScreen";

export default function Game() {
  const [gameStarted, setGameStarted] = useState(false);

  // Bring in Gamepad input
  // Check for button input
  // Change state to game started
  // Display different component for game started
  // Pass setGameStart to game component to allow it to end itself (like quit game menu option)

  if (gameStarted) {
    return <GameScreen setGameStarted={setGameStarted} />;
  }

  return <StartScreen setGameStarted={setGameStarted} />;
}
