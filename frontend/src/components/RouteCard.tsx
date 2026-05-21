import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Route } from "../types/route";

interface RouteCardProps {
  route: Route;
  onPress: (route: Route) => void;
}

export default function RouteCard({ route, onPress }: RouteCardProps) {
  const displayName = route.short_name || route.route_id;
  const description = route.long_name || "";
  const bgColor = route.color ? `#${route.color}` : "#007AFF";

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(route)} activeOpacity={0.7}>
      <View style={[styles.badge, { backgroundColor: bgColor }]}>
        <Text style={[styles.badgeText, route.text_color ? { color: `#${route.text_color}` } : undefined]}>
          {displayName}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {displayName}
        </Text>
        {description ? (
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
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
  badge: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  badgeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  description: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
});
