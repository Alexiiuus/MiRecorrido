import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Route } from "../types/route";
import { fetchRoutes } from "../api/routes.api";
import RouteCard from "../components/RouteCard";
import LoadingState from "../components/LoadingState";

interface RoutesScreenProps {
  navigation: any;
}

export default function RoutesScreen({ navigation }: RoutesScreenProps) {
  const insets = useSafeAreaInsets();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filtered, setFiltered] = useState<Route[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRoutes();
  }, []);

  async function loadRoutes() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRoutes();
      setRoutes(data);
      setFiltered(data);
    } catch (e: any) {
      setError("No se pudieron cargar las líneas. Verificá que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = useCallback(
    (text: string) => {
      setSearch(text);
      if (!text.trim()) {
        setFiltered(routes);
        return;
      }
      const q = text.toLowerCase();
      setFiltered(
        routes.filter(
          (r) =>
            (r.short_name && r.short_name.toLowerCase().includes(q)) ||
            (r.long_name && r.long_name.toLowerCase().includes(q)) ||
            r.route_id.toLowerCase().includes(q)
        )
      );
    },
    [routes]
  );

  function handleRoutePress(route: Route) {
    navigation.navigate("PatternSelection", { routeId: route.route_id, routeName: route.short_name || route.route_id });
  }

  if (loading) {
    return <LoadingState message="Cargando líneas..." />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Mi Recorrido</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar línea por número o nombre..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!error && filtered.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {search ? "No se encontraron líneas con ese criterio" : "No hay líneas disponibles"}
          </Text>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.route_id}
        renderItem={({ item }) => (
          <RouteCard route={item} onPress={handleRoutePress} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  list: {
    paddingBottom: 20,
  },
  errorContainer: {
    padding: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    textAlign: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 15,
  },
});
