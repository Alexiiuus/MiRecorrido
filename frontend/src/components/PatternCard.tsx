import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pattern } from "../types/pattern";

interface PatternCardProps {
  pattern: Pattern;
  stopCount?: number;
  onPress: (pattern: Pattern) => void;
}

export default function PatternCard({ pattern, stopCount, onPress }: PatternCardProps) {
  const direction = pattern.direction_id === 0 ? "Ida" : pattern.direction_id === 1 ? "Vuelta" : "Circular";
  const headsign = pattern.headsign || "Sin indicación";

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(pattern)} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.directionBadge}>
          <Text style={styles.directionText}>{direction}</Text>
        </View>
        {stopCount !== undefined && (
          <Text style={styles.stopCount}>{stopCount} paradas</Text>
        )}
      </View>
      <Text style={styles.headsign} numberOfLines={2}>
        {headsign}
      </Text>
      {pattern.shape_id && (
        <Text style={styles.shapeId}>Shape: {pattern.shape_id}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  directionBadge: {
    backgroundColor: "#E8F0FE",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  directionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
  },
  stopCount: {
    fontSize: 12,
    color: "#888",
  },
  headsign: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  shapeId: {
    fontSize: 11,
    color: "#aaa",
    marginTop: 4,
  },
});
