import React, { useState } from "react";
import useInterval from "../hooks/useInterval";

export default function Countdown({ start = 3 }) {
  const [time, setTime] = useState(start);

  useInterval(() => {
    if (time > 0) {
      setTime((prevTime) => prevTime - 1);
    }
  }, 1000);
  return <div>{time}</div>;
}
