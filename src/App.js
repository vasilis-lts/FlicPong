import React from "react";
import { useCurrentRoute, useViewElement } from "react-navi";
import { animated, useTransition } from "react-spring";

export default function App() {
  let currentRoute = useCurrentRoute();
  let viewElement = useViewElement();

  let transitions = useTransition(
    viewElement,
    currentRoute.url.href,
    currentRoute.url.href === "/main-menu"
      ? {
          from: {
            opacity: 1
            // transform: "translateX(-100%)"
          },
          enter: {
            opacity: 1
            // transform: "translateX(0)"
          },
          leave: {
            opacity: 1
            // transform: "translateX(100%)"
          }
        }
      : {
          from: { opacity: 0 },
          enter: { opacity: 1 },
          leave: {
            opacity: 0
            // transform: "translateX(-100%)"
          }
        }
  );

  return transitions.map(({ item, props: style, key, state }) => (
    <animated.div
      key={key}
      style={{
        ...style,
        top: 0,
        width: "100%"
      }}
    >
      {item}
    </animated.div>
  ));
}
