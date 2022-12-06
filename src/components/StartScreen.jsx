import React, { useState, useEffect } from "react";
import useGamepads from "../hooks/useGamepads";

export default function StartScreen({ setGameStarted }) {
  useGamepads((gamepads) => {
    // If controller connected with buttons
    if (gamepads && gamepads[0] && gamepads[0].buttons.length > 0) {
      // Go through each button and check for pressed
      gamepads[0].buttons.forEach((button) => {
        if (button.pressed) {
          setGameStarted(true);
        }
      });
    }
  });

  return <div>Press any button to start</div>;
}
