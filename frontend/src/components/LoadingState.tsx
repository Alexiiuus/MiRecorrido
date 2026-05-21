import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Cargando..." }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});
