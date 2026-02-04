import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ShipmentFormScreen from "../screens/ShipmentFormScreen";
import ShipmentHistoryScreen from "../screens/ShipmentHistoryScreen";
import ShipmentDetailScreen from "../screens/ShipmentDetailScreen";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token } = useAuth();

  return (
    <Stack.Navigator>
      {!token ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Halaman Utama" }}
          />
          <Stack.Screen
            name="ShipmentForm"
            component={ShipmentFormScreen}
            options={{ title: "Input Pengiriman" }}
          />
          <Stack.Screen
            name="ShipmentHistory"
            component={ShipmentHistoryScreen}
            options={{ title: "Riwayat Pengiriman" }}
          />
          <Stack.Screen
            name="ShipmentDetail"
            component={ShipmentDetailScreen}
            options={{ title: "Detail Pengiriman" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
