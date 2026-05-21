import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { MapStyleElement, Polyline } from "react-native-maps";

const buildingsOffStyle: MapStyleElement[] = [
  {
    featureType: "building",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
];
import { NearestStop } from "../types/nearestStop";
import { ShapePoint } from "../types/shape";
import { StopResponse, StopTimeResponse } from "../types/stop";
import { fetchShape, fetchStops, getNearestStops } from "../api/patterns.api";
import { fetchStopTimes } from "../api/stops.api";
import { getLatitude, getLongitude, isValidCoordinate } from "../utils/coordinateUtils";
import { haversineDistanceMeters } from "../utils/distanceUtils";
import { classifyStop, sortStopsBySequence } from "../utils/stopUtils";
import { getNearestHighlightType } from "../utils/nearestStopUtils";
import useCurrentLocation from "../hooks/useCurrentLocation";
import LoadingState from "../components/LoadingState";
import NearestStopsPanel from "../components/NearestStopsPanel";
import StopTimesPanel from "../components/StopTimesPanel";
import StopMarker from "../components/StopMarker";

interface MapScreenProps {
  navigation: any;
  route: any;
}

function formatTime(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function getTodayDate(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function MapScreen({ route: navRoute }: MapScreenProps) {
  const { patternId } = navRoute.params;
  const mapRef = useRef<MapView>(null);

  const [shapePoints, setShapePoints] = useState<ShapePoint[]>([]);
  const [stops, setStops] = useState<StopResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStop, setSelectedStop] = useState<StopResponse | null>(null);
  const [stopTimes, setStopTimes] = useState<StopTimeResponse[]>([]);
  const [timesLoading, setTimesLoading] = useState(false);
  const [timesError, setTimesError] = useState<string | null>(null);

  const {
    currentLocation,
    heading,
    error: locationError,
    startTracking,
    stopTracking,
  } = useCurrentLocation();

  const [gpsMode, setGpsMode] = useState(false);

  const [nearestStops, setNearestStops] = useState<NearestStop[]>([]);
  const [nearestStopsLoading, setNearestStopsLoading] = useState(false);
  const [nearestStopsError, setNearestStopsError] = useState<string | null>(null);
  const lastQueryRef = useRef<{ lat: number; lon: number; time: number } | null>(null);

  useEffect(() => {
    loadMapData();
    return () => {
      stopTracking();
    };
  }, []);

  useEffect(() => {
    if (gpsMode && currentLocation && mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
          pitch: 45,
          heading: heading ?? 0,
          zoom: 17,
        },
        { duration: 700 }
      );
    }
  }, [gpsMode, currentLocation, heading]);

  useEffect(() => {
    if (!gpsMode || !currentLocation) return;

    const now = Date.now();
    const last = lastQueryRef.current;

    if (
      last &&
      now - last.time < 5000 &&
      haversineDistanceMeters(
        currentLocation.latitude,
        currentLocation.longitude,
        last.lat,
        last.lon
      ) < 10
    ) {
      return;
    }

    lastQueryRef.current = {
      lat: currentLocation.latitude,
      lon: currentLocation.longitude,
      time: now,
    };

    fetchNearestStops(currentLocation.latitude, currentLocation.longitude);
  }, [gpsMode, currentLocation]);

  async function fetchNearestStops(lat: number, lon: number) {
    setNearestStopsLoading(true);
    setNearestStopsError(null);

    try {
      const data = await getNearestStops(patternId, lat, lon, 2);
      setNearestStops(data.nearest_stops || []);
    } catch {
      try {
        const local = await import("../utils/nearestStops").then((m) =>
          m.getNearestStopsFromList(stops, lat, lon, 2)
        );
        setNearestStops(local);
      } catch {
        setNearestStopsError("No se pudieron obtener las paradas cercanas.");
      }
    } finally {
      setNearestStopsLoading(false);
    }
  }

  async function loadMapData() {
    try {
      setLoading(true);
      setError(null);
      const [shapeData, stopsData] = await Promise.all([
        fetchShape(patternId),
        fetchStops(patternId),
      ]);
      setShapePoints(shapeData.points || []);
      const sorted = sortStopsBySequence(stopsData || []);
      setStops(sorted);

      setTimeout(() => {
        if (mapRef.current && (shapeData.points?.length || stopsData?.length)) {
          const coords = [
            ...(shapeData.points || []).map((p: any) => ({
              latitude: getLatitude(p),
              longitude: getLongitude(p),
            })),
            ...(sorted || []).map((s: any) => ({
              latitude: getLatitude(s),
              longitude: getLongitude(s),
            })),
          ].filter((c) => isValidCoordinate(c.latitude, c.longitude));
          if (coords.length > 0) {
            mapRef.current.fitToCoordinates(coords, {
              edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
              animated: true,
            });
          }
        }
      }, 500);
    } catch {
      setError("No se pudo cargar el mapa del recorrido.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStopPress(stop: StopResponse) {
    setSelectedStop(stop);
    setTimesLoading(true);
    setTimesError(null);
    setStopTimes([]);

    try {
      const now = new Date();
      const times = await fetchStopTimes(stop.stop_id, {
        date: getTodayDate(),
        from_time: formatTime(now),
        limit: 10,
      });
      setStopTimes(times || []);
    } catch {
      setTimesError("No se pudieron cargar los horarios de esta parada.");
    } finally {
      setTimesLoading(false);
    }
  }

  async function handleToggleGpsMode() {
    if (gpsMode) {
      setGpsMode(false);
      stopTracking();
      setTimeout(() => {
        if (mapRef.current) {
          const allCoords = [
            ...shapePoints.map((p) => ({
              latitude: getLatitude(p),
              longitude: getLongitude(p),
            })),
            ...stops.map((s) => ({
              latitude: getLatitude(s),
              longitude: getLongitude(s),
            })),
          ].filter((c) => isValidCoordinate(c.latitude, c.longitude));
          if (allCoords.length > 0) {
            mapRef.current.fitToCoordinates(allCoords, {
              edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
              animated: true,
            });
          }
        }
      }, 300);
    } else {
      setGpsMode(true);
      await startTracking();
    }
  }

  if (loading) {
    return <LoadingState message="Cargando recorrido..." />;
  }

  if (error) {
    return <LoadingState message={error} />;
  }

  const polylineCoords = shapePoints
    .map((p) => ({
      latitude: getLatitude(p),
      longitude: getLongitude(p),
    }))
    .filter((c) => isValidCoordinate(c.latitude, c.longitude));

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={gpsMode}
        customMapStyle={gpsMode ? buildingsOffStyle : []}
        initialRegion={
          polylineCoords.length > 0
            ? {
                latitude: polylineCoords[0].latitude,
                longitude: polylineCoords[0].longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : undefined
        }
      >
        {polylineCoords.length > 1 && (
          <Polyline
            coordinates={polylineCoords}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        )}

        {stops.map((stop, index) => {
          const type = classifyStop(index, stops.length);
          const highlightType = gpsMode
            ? getNearestHighlightType(stop, nearestStops)
            : null;
          return (
            <StopMarker
              key={stop.stop_id}
              stop={stop}
              type={type}
              highlightType={highlightType}
              isSelected={selectedStop?.stop_id === stop.stop_id}
              onPress={() => handleStopPress(stop)}
            />
          );
        })}
      </MapView>

      <TouchableOpacity
        style={[styles.gpsButton, gpsMode && styles.gpsButtonActive]}
        onPress={handleToggleGpsMode}
      >
        <Text style={[styles.gpsButtonText, gpsMode && styles.gpsButtonTextActive]}>
          {gpsMode ? "Salir de recorrido" : "Recorrido"}
        </Text>
      </TouchableOpacity>

      {gpsMode && locationError && (
        <View style={styles.locationBanner}>
          <Text style={styles.locationBannerText}>{locationError}</Text>
        </View>
      )}

      {gpsMode && !selectedStop && (
        <NearestStopsPanel
          stops={nearestStops}
          loading={nearestStopsLoading}
          error={nearestStopsError}
        />
      )}

      {selectedStop && (
        <StopTimesPanel
          stopName={selectedStop.name}
          times={stopTimes}
          loading={timesLoading}
          error={timesError}
          onClose={() => setSelectedStop(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  gpsButton: {
    position: "absolute",
    top: 16,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  gpsButtonActive: {
    backgroundColor: "#FF3B30",
  },
  gpsButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#007AFF",
  },
  gpsButtonTextActive: {
    color: "#fff",
  },
  locationBanner: {
    position: "absolute",
    top: 72,
    alignSelf: "center",
    backgroundColor: "rgba(255, 59, 48, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  locationBannerText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
  },
});
