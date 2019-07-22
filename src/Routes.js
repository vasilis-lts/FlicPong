import { lazy, mount, route } from "navi";
import { Router } from "react-navi";

// Define your routes
export default mount({
  "/": route({
    title: "The createSwitch() function",
    getView: () => import("./screens/MainMenu")
  }),

  "/": redirect("/")
});
