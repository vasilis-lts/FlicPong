export default function useLocalStorage(action) {
  const clearScore = () => {
    localStorage.setItem("ScoreTeam1", 0);
    localStorage.setItem("ScoreTeam2", 0);
  };

  const increaseSetsWon = team => {
    let setsWon = localStorage.getItem("SetsWon" + team);
    setsWon++;
    localStorage.setItem("SetsWon" + team, setsWon);
    return parseInt(setsWon, 10);
  };

  switch (action) {
    case "clearScore":
      clearScore();
      break;
    case "increaseSetsWon":
      increaseSetsWon();
      break;

    default:
      break;
  }

  return { clearScore, increaseSetsWon };
}
