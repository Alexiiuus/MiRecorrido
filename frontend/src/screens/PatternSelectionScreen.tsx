import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Pattern } from "../types/pattern";
import { fetchPatterns, fetchStops } from "../api/patterns.api";
import PatternCard from "../components/PatternCard";
import LoadingState from "../components/LoadingState";

interface PatternSelectionScreenProps {
  navigation: any;
  route: any;
}

export default function PatternSelectionScreen({
  navigation,
  route: navRoute,
}: PatternSelectionScreenProps) {
  const { routeId, routeName } = navRoute.params;
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [stopCounts, setStopCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchingStops, setFetchingStops] = useState(false);

  useEffect(() => {
    loadPatterns();
  }, []);

  async function loadPatterns() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPatterns(routeId);
      setPatterns(data);
      if (data.length > 0) {
        loadStopCounts(data);
      }
    } catch (e: any) {
      setError("No se pudieron cargar los recorridos de esta línea.");
    } finally {
      setLoading(false);
    }
  }

  async function loadStopCounts(patterns: Pattern[]) {
    setFetchingStops(true);
    const counts: Record<string, number> = {};
    await Promise.allSettled(
      patterns.map(async (p) => {
        try {
          const stops = await fetchStops(p.pattern_id);
          counts[p.pattern_id] = stops.length;
        } catch {
          counts[p.pattern_id] = 0;
        }
      })
    );
    setStopCounts(counts);
    setFetchingStops(false);
  }

  function handlePatternPress(pattern: Pattern) {
    navigation.navigate("Map", { patternId: pattern.pattern_id });
  }

  if (loading) {
    return <LoadingState message="Cargando recorridos..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Línea {routeName}</Text>
        <Text style={styles.subtitle}>Seleccioná un recorrido</Text>
      </View>

      {error && (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!error && patterns.length === 0 && (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>
            No hay recorridos disponibles para esta línea.
          </Text>
        </View>
      )}

      {patterns.length > 0 && (
        <FlatList
          data={patterns}
          keyExtractor={(item) => item.pattern_id}
          renderItem={({ item }) => (
            <PatternCard
              pattern={item}
              stopCount={stopCounts[item.pattern_id]}
              onPress={handlePatternPress}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  list: {
    paddingBottom: 20,
  },
  centerContent: {
    padding: 40,
    alignItems: "center",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    textAlign: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 15,
    textAlign: "center",
  },
});
