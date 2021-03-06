import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

import { mount, redirect, route } from "navi";
import { Router, View } from "react-navi";
import { GameProvider } from "./context/GameContext";
import Layout from "./Layout";

const routes = mount({
  "/main-menu": route({
    title: "Main Menu",
    getView: () => import("./screens/MainMenu")
  }),
  "/2v2": route({
    title: "2v2 mode",
    getView: () => import("./screens/2v2Screen")
  }),
  "/": redirect("/main-menu"),
  "*": redirect("/main-menu", { exact: false })
});

ReactDOM.render(
  <GameProvider>
    <Router routes={routes}>
      <Layout>
        <Suspense fallback={null}>
          <View />
        </Suspense>
      </Layout>
    </Router>
  </GameProvider>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
