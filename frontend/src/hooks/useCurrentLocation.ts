import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

interface UseCurrentLocationReturn {
  currentLocation: { latitude: number; longitude: number } | null;
  heading: number;
  permissionStatus: Location.PermissionStatus | null;
  error: string | null;
  tracking: boolean;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
}

export default function useCurrentLocation(): UseCurrentLocationReturn {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [heading, setHeading] = useState(0);
  const [permissionStatus, setPermissionStatus] =
    useState<Location.PermissionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tracking, setTracking] = useState(false);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stopTracking();
    };
  }, []);

  async function requestPermission(): Promise<boolean> {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      if (status !== "granted") {
        setError(
          "No se otorgaron permisos de ubicación. Activá la ubicación en Ajustes."
        );
        return false;
      }
      setError(null);
      return true;
    } catch {
      setError("Error al solicitar permisos de ubicación.");
      setPermissionStatus(null);
      return false;
    }
  }

  async function startTracking() {
    const granted = await requestPermission();
    if (!granted) return;

    setTracking(true);

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (mountedRef.current && loc.coords) {
        setCurrentLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (loc.coords.heading != null) {
          setHeading(loc.coords.heading);
        }
      }
    } catch {
      if (mountedRef.current) {
        setError("No se pudo obtener la ubicación actual.");
      }
    }

    try {
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 2500,
          distanceInterval: 10,
        },
        (location) => {
          if (!mountedRef.current) return;
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          if (location.coords.heading != null) {
            setHeading(location.coords.heading);
          }
        }
      );
      subscriptionRef.current = sub;
    } catch {
      if (mountedRef.current) {
        setError("Error al iniciar el seguimiento de ubicación.");
      }
    }
  }

  function stopTracking() {
    setTracking(false);
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
  }

  return {
    currentLocation,
    heading,
    permissionStatus,
    error,
    tracking,
    startTracking,
    stopTracking,
  };
}
