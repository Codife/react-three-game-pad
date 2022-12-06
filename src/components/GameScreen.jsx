import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from "react";
import useGamepads from "../hooks/useGamepads";
import useTimeout from "../hooks/useTimeout";
import useInterval from "../hooks/useInterval";
import Countdown from "./Countdown";
import { throttle } from "lodash";
import AwesomeDebouncePromise from "awesome-debounce-promise";

const GAME_DURATION = 30;
const PLAYER_POSITION_ADJUST = 1;

const calculateScore = (currentPosition) => {
  // Full score is 100 points
  // Gets reduced for the bigger difference
  // between starting position (500) and current
  const difference = 500 - currentPosition;
  const normalizedDiff =
    Math.sign(difference) === -1 ? difference * -1 : difference;
  const score = 100 - (normalizedDiff * 100) / 500;
  return score;
};

export default function GameScreen({ setGameStarted }) {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [position, setPosition] = useState(500);
  const [score, setScore] = useState(0);

  const increasePosition = useCallback(() => {
    // console.log("increasing");
    setPosition((prevPosition) => prevPosition + PLAYER_POSITION_ADJUST);
  }, [setPosition]);

  const increasePositionDebounced = useMemo(
    () => throttle(increasePosition, 100),
    [increasePosition]
  );

  const decreasePosition = useCallback(() => {
    setPosition((prevPosition) => {
      const newPosition = prevPosition - PLAYER_POSITION_ADJUST;

      return newPosition > 0 ? newPosition : 0;
    });
  }, [setPosition]);

  const decreasePositionDebounced = useMemo(
    () => throttle(decreasePosition, 100),
    [decreasePosition]
  );

  useGamepads((gamepads) => {
    if (started) {
      // If controller connected with buttons
      if (gamepads && gamepads[0] && gamepads[0].buttons.length > 0) {
        // Pressed Up
        if (gamepads[0].buttons[12].pressed) {
          // AwesomeDebouncePromise(() => increasePosition, 20000);
          // throttle(increasePosition, 10000);
          increasePositionDebounced();
        }
        // Pressed Down
        if (gamepads[0].buttons[13].pressed) {
          // AwesomeDebouncePromise(() => decreasePosition, 20000);
          // throttle(decreasePosition, 10000);
          decreasePositionDebounced();
        }

        // Handle axes
        if ("axes" in gamepads[0]) {
          // Each analog stick is an "axe"
          // Axes are delivered in a array of 2 numbers per axe
          // The first is left and right
          // The second is top and bottom
          // If a number is -1 or 1, it's one side or the other

          // Up
          -0.2 > gamepads[0].axes[1] > 0.2 && increasePositionDebounced();
          // Down
          0.2 > gamepads[0].axes[1] < 0.2 && decreasePositionDebounced();
        }
      }
    }
    if (gameOver) {
      if (gamepads && gamepads[0] && gamepads[0].buttons.length > 0) {
        gamepads[0].buttons.forEach((button) => {
          if (button.pressed) {
            setGameStarted(false);
          }
        });
      }
    }
  });

  // Starts game after 3 second countdown
  useTimeout(() => setStarted(true), 3000);
  // Ends game after 30 seconds (+ 3 seconds for pre)
  useTimeout(() => {
    setStarted(false);
    setGameOver(true);
  }, GAME_DURATION * 1000 + 3000);

  const endGameHandler = () => {
    setGameStarted(false);
  };

  // Make position drop every second
  useInterval(() => {
    if (started) {
      setPosition((prevPosition) => {
        const newPosition = prevPosition - 10;

        return newPosition > 0 ? newPosition : 0;
      });
      setScore((prevScore) => Math.round(prevScore + calculateScore(position)));
    }
  }, 1000);

  // Game over screen
  if (gameOver) {
    return (
      <div>
        <h1>Game over!</h1>
        <h3>Final score: {score}</h3>
        <button onClick={endGameHandler}>Try again</button>
      </div>
    );
  }

  // Game is running
  if (started) {
    return (
      <div>
        <h1>Position: {position}</h1>
        <h3>Score: {score}</h3>
        <h5>
          Time left: <Countdown start={GAME_DURATION} />
        </h5>
      </div>
    );
  }

  // Countdown to game
  return <Countdown start={3} />;
}
