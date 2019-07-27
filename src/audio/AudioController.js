import UIfx from "uifx";
import menuSelect from "../audio/menu-select.mp3";
import menuMove from "../audio/menu-move.mp3";

const menuSelectSound = new UIfx({
  asset: menuSelect,
  volume: 1, // number between 0.0 ~ 1.0
  throttleMs: 100
});

const menuMoveSound = new UIfx({
  asset: menuMove,
  volume: 1, // number between 0.0 ~ 1.0
  throttleMs: 100
});

const Audio = {
  menuSelect: () => {
    menuSelectSound.play();
  },
  menuMove: () => {
    menuMoveSound.play();
  }
};
export default Audio;
