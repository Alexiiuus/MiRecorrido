import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StopTimeResponse } from "../types/stop";

interface StopTimesPanelProps {
  stopName: string;
  times: StopTimeResponse[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export default function StopTimesPanel({
  stopName,
  times,
  loading,
  error,
  onClose,
}: StopTimesPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stopName} numberOfLines={1}>
          {stopName}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Cerrar</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.centerContent}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando horarios...</Text>
        </View>
      )}

      {error && (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && times.length === 0 && (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No hay horarios disponibles</Text>
        </View>
      )}

      {!loading && !error && times.length > 0 && (
        <FlatList
          data={times}
          keyExtractor={(item, index) => `${item.trip_id}-${index}`}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{item.arrival_time}</Text>
              <View style={styles.timeInfo}>
                <Text style={styles.routeText}>Línea {item.route_short_name}</Text>
                {item.headsign && (
                  <Text style={styles.headsignText} numberOfLines={1}>
                    {item.headsign}
                  </Text>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: 320,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  stopName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  closeText: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "600",
  },
  centerContent: {
    padding: 24,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#888",
  },
  errorText: {
    fontSize: 14,
    color: "#d32f2f",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
  },
  list: {
    maxHeight: 220,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    width: 80,
    fontVariant: ["tabular-nums"],
  },
  timeInfo: {
    flex: 1,
    marginLeft: 8,
  },
  routeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  headsignText: {
    fontSize: 12,
    color: "#888",
    marginTop: 1,
  },
});
