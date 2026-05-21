import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";
import { StopType } from "../utils/stopUtils";
import { StopResponse } from "../types/stop";
import { getLatitude, getLongitude, isValidCoordinate } from "../utils/coordinateUtils";

interface StopMarkerProps {
  stop: StopResponse;
  type: StopType;
  isSelected: boolean;
  onPress: () => void;
}

export default function StopMarker({
  stop,
  type,
  isSelected,
  onPress,
}: StopMarkerProps) {
  const latitude = getLatitude(stop);
  const longitude = getLongitude(stop);

  if (!isValidCoordinate(latitude, longitude)) return null;

  if (type === "middle") {
    return (
      <Marker
        coordinate={{ latitude, longitude }}
        onPress={onPress}
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <View
          style={[
            styles.middleMarker,
            isSelected && styles.middleMarkerSelected,
          ]}
        />
      </Marker>
    );
  }

  const isStart = type === "start";

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View
        style={[
          styles.endpointMarker,
          isStart ? styles.startMarker : styles.endMarker,
          isSelected && styles.endpointMarkerSelected,
        ]}
      >
        <Text style={styles.endpointText}>{isStart ? "I" : "F"}</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  middleMarker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#007AFF",
    borderWidth: 2,
    borderColor: "#fff",
  },
  middleMarkerSelected: {
    backgroundColor: "#d32f2f",
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  endpointMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  startMarker: {
    backgroundColor: "#34C759",
  },
  endMarker: {
    backgroundColor: "#FF3B30",
  },
  endpointMarkerSelected: {
    borderColor: "#000",
    borderWidth: 3,
  },
  endpointText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});
