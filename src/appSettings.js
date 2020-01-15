const BaseUrl = "http://localhost:3001/Api";

const appSettings = {
  endpoints: {
    GetPlayers: BaseUrl + "/GetPlayers",
    Save2v2Match: BaseUrl + "/Save2v2Match",
    UpdatePlayers2v2Wins: BaseUrl + "/UpdatePlayers2v2Wins",
    FlicClick: BaseUrl + "/FlicClick"
  },
  ButtonActions: {
    SinglePress: "SinglePress",
    DoublePress: "DoublePress",
    Hold: "Hold"
  }
};
export default appSettings;
