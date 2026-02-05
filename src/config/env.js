import { Platform } from "react-native";

export const ENV = {
  API_BASE_URL:
    Platform.OS === "web"
      ? "http://localhost:4001/api"
      : "https://pecuniarily-cofinal-mui.ngrok-free.dev/api"
};
