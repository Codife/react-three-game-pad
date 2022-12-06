import React, { useState } from "react";
import "./styles.css";

import Game from "./components/Game";
import GamepadController from "./components/GamepadController";

export default function App() {
  return (
    <div className="App">
      <Game />
      <GamepadController />
    </div>
  );
}
