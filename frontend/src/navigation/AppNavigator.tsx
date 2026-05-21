import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RoutesScreen from "../screens/RoutesScreen";
import PatternSelectionScreen from "../screens/PatternSelectionScreen";
import MapScreen from "../screens/MapScreen";

export type RootStackParamList = {
  Routes: undefined;
  PatternSelection: { routeId: string; routeName: string };
  Map: { patternId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#f5f5f7" },
          headerTintColor: "#007AFF",
          headerTitleStyle: { fontWeight: "600", color: "#1a1a1a" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Routes"
          component={RoutesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PatternSelection"
          component={PatternSelectionScreen}
          options={({ route }) => ({
            title: `Línea ${(route.params as any).routeName || ""}`,
            headerBackTitle: "Volver",
          })}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{
            title: "Recorrido",
            headerBackTitle: "Volver",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
