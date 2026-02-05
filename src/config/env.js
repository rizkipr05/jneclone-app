import { Platform } from "react-native";

export const ENV = {
  API_BASE_URL:
    Platform.OS === "web"
      ? "http://localhost:4001/api"
      : "http://10.60.168.77:4001/api"
};
