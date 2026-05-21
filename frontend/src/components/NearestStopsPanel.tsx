import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NearestStop } from "../types/nearestStop";
import { formatDistance } from "../utils/distanceUtils";

interface NearestStopsPanelProps {
  stops: NearestStop[];
  loading: boolean;
  error: string | null;
  guideHint?: "guide" | "nearby";
}

export default function NearestStopsPanel({
  stops,
  loading,
  error,
  guideHint,
}: NearestStopsPanelProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Paradas cercanas</Text>
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Buscando paradas cercanas...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Paradas cercanas</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (stops.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Paradas cercanas</Text>
        <Text style={styles.emptyText}>
          No se encontraron paradas cercanas para este recorrido.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paradas cercanas</Text>
      {stops.map((stop, index) => (
        <View key={stop.stop_id} style={styles.stopRow}>
          <View style={styles.indexBadge}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>
          <View style={styles.stopInfo}>
            <Text style={styles.stopName} numberOfLines={1}>
              {stop.street_name || stop.name}
            </Text>
          </View>
          <Text style={styles.distance}>{formatDistance(stop.distance_meters)}</Text>
        </View>
      ))}
      {guideHint === "guide" && (
        <Text style={styles.guideText}>
          Seguí la línea guía para llegar a la parada.
        </Text>
      )}
      {guideHint === "nearby" && (
        <Text style={styles.nearbyText}>
          Estás cerca de la parada más próxima.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#888",
  },
  errorText: {
    fontSize: 13,
    color: "#d32f2f",
  },
  emptyText: {
    fontSize: 13,
    color: "#888",
  },
  stopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
  },
  indexBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  indexText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  distance: {
    fontSize: 13,
    fontWeight: "600",
    color: "#007AFF",
    marginLeft: 8,
  },
  guideText: {
    marginTop: 10,
    fontSize: 13,
    color: "#FF9500",
    fontWeight: "600",
    textAlign: "center",
  },
  nearbyText: {
    marginTop: 10,
    fontSize: 13,
    color: "#34C759",
    fontWeight: "600",
    textAlign: "center",
  },
});
