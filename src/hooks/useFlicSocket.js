import React, { useState, useEffect } from "react";

export default function useFlicSocket(message) {
  const [Action, setAction] = useState("SingleClick");

  useEffect(() => {
    console.log(message);
    setAction(message.buttonAction);
  }, [message]);

  return Action;
}
