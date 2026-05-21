import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";
import { StopType, StopHighlightType } from "../utils/stopUtils";
import { StopResponse } from "../types/stop";
import { getLatitude, getLongitude, isValidCoordinate } from "../utils/coordinateUtils";

interface StopMarkerProps {
  stop: StopResponse;
  type: StopType;
  highlightType?: StopHighlightType;
  isSelected: boolean;
  onPress: () => void;
}

function getLabel(type: StopType, highlight?: StopHighlightType): string {
  if (highlight === "nearest-1") return "1";
  if (highlight === "nearest-2") return "2";
  if (type === "start") return "I";
  if (type === "end") return "F";
  return "";
}

function getColor(type: StopType, highlight?: StopHighlightType): string {
  if (highlight === "nearest-1") return "#5856D6";
  if (highlight === "nearest-2") return "#007AFF";
  if (type === "start") return "#34C759";
  if (type === "end") return "#FF3B30";
  return "#007AFF";
}

export default function StopMarker({
  stop,
  type,
  highlightType,
  isSelected,
  onPress,
}: StopMarkerProps) {
  const lat = getLatitude(stop);
  const lng = getLongitude(stop);

  if (!isValidCoordinate(lat, lng)) return null;

  const label = getLabel(type, highlightType);
  const color = getColor(type, highlightType);
  const isHighlighted = highlightType !== null;

  let innerSize: number;
  if (highlightType === "nearest-1") innerSize = 28;
  else if (highlightType === "nearest-2") innerSize = 24;
  else if (type === "middle") innerSize = 14;
  else innerSize = 32;

  const haloSize = highlightType === "nearest-1" ? 44 : 36;
  const outerRingVisible = isHighlighted || !isSelected;

  return (
    <Marker
      coordinate={{ latitude: lat, longitude: lng }}
      onPress={onPress}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.wrapper}>
        {isHighlighted && (
          <View
            style={[
              styles.halo,
              {
                width: haloSize,
                height: haloSize,
                borderRadius: haloSize / 2,
                borderColor: color,
              },
            ]}
          />
        )}
        <View
          style={[
            styles.inner,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
              backgroundColor: color,
            },
            outerRingVisible && styles.innerRing,
            isSelected && styles.selected,
          ]}
        >
          {label !== "" && (
            <Text
              style={[
                styles.label,
                isHighlighted ? styles.labelLarge : styles.labelSmall,
              ]}
            >
              {label}
            </Text>
          )}
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    position: "absolute",
    borderWidth: 2.5,
    opacity: 0.7,
  },
  inner: {
    justifyContent: "center",
    alignItems: "center",
  },
  innerRing: {
    borderWidth: 2.5,
    borderColor: "#fff",
  },
  selected: {
    borderColor: "#000",
    borderWidth: 3,
  },
  label: {
    color: "#fff",
    fontWeight: "800",
  },
  labelLarge: {
    fontSize: 16,
  },
  labelSmall: {
    fontSize: 14,
  },
});
