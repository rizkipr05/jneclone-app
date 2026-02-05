import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ShipmentFormScreen from "../screens/ShipmentFormScreen";
import ShipmentHistoryScreen from "../screens/ShipmentHistoryScreen";
import ShipmentDetailScreen from "../screens/ShipmentDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../styles/theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          height: 68,
          marginHorizontal: 20,
          marginBottom: 16,
          borderRadius: 18,
          paddingTop: 10,
          paddingBottom: 10,
          shadowColor: "#0B1220",
          shadowOpacity: 0.12,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
          position: "absolute"
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          color: COLORS.text
        },
        tabBarActiveTintColor: "#0E9F4B",
        tabBarInactiveTintColor: COLORS.text,
        tabBarIcon: ({ focused }) => {
          const iconMap = {
            Home: "home-variant",
            ShipmentForm: "clipboard-text-outline",
            ShipmentHistory: "history",
            Profile: "account-circle-outline"
          };
          return (
            <Text
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                textAlign: "center",
                textAlignVertical: "center",
                backgroundColor: focused ? "#E9F7EF" : "#F1F3F7"
              }}
            >
              <MaterialCommunityIcons
                name={iconMap[route.name]}
                size={18}
                color={focused ? "#0E9F4B" : "#6B7280"}
              />
            </Text>
          );
        }
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="ShipmentForm"
        component={ShipmentFormScreen}
        options={{ title: "Input Pengiriman" }}
      />
      <Tab.Screen
        name="ShipmentHistory"
        component={ShipmentHistoryScreen}
        options={{ title: "Riwayat Pengiriman" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profil" }}
      />
    </Tab.Navigator>
  );
}

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
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
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
