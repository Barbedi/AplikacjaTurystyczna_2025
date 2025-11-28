import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  MapView,
  Camera,
  RasterSource,
  RasterLayer,
  ShapeSource,
  LineLayer,
  CircleLayer,
} from "@maplibre/maplibre-react-native";
import { Shelters, Peaks } from "../../src/types";
import BottomSheet from "@gorhom/bottom-sheet";
import RouteBottomSheet, {
  RouteBottomSheetRef,
} from "../../src/components/map/RouteBottomSheet";
import ModalShelterPeak from "../../src/components/map/modalShelterPeak";
import trailsService from "../../src/services/trails.service";
import { getAuthenticatedUser } from "../../src/config/api";
import useGetUsers from "../../src/hooks/useGetUser";
import FeaturesListService from "../../src/services/featuresList.service";

const MapScreen = () => {
  const MAPTILER_KEY = "DdJo20VMMy7tFRXLTfO6";
  const bottomSheetRef = useRef<RouteBottomSheetRef>(null);
  const { getUserByEmail, usersData } = useGetUsers();

  const [shelters, setShelters] = useState<Shelters[]>([]);
  const [peaks, setPeaks] = useState<Peaks[]>([]);
  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
  const [routeType] = useState<"one-way" | "loop" | "back-and-forth">(
    "one-way",
  );
  const [clickedPoints, setClickedPoints] = useState<
    Array<{ coords: [number, number]; name?: string }>
  >([]);
  const [saving, setSaving] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<{
    type: "shelter" | "peak";
    data: Shelters | Peaks;
  } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authData = await getAuthenticatedUser();
        if (authData?.user?.email) {
          await getUserByEmail(authData.user.email);
        }
      } catch (error) {
        console.error("B\u0142\u0105d \u0142adowania u\u017cytkownika:", error);
      }
    };
    loadUser();
  }, [getUserByEmail]);

  const currentUser = usersData?.[0]?.[0];

  const handlePress = (e: any) => {
    const { geometry } = e;
    if (geometry?.coordinates) {
      const coord = geometry.coordinates;
      setClickedPoints((prev) => [...prev, { coords: coord }]);
    }
  };

  const handleShelterPress = (shelter: Shelters) => {
    setSelectedFeature({ type: "shelter", data: shelter });
  };

  const handlePeakPress = (peak: Peaks) => {
    setSelectedFeature({ type: "peak", data: peak });
  };

  useEffect(() => {
    fetch("http://10.0.2.2:6868/shelters")
      .then((res) => res.json())
      .then((json) => setShelters(json.data))
      .catch(console.error);
  }, []);
  useEffect(() => {
    fetch("http://10.0.2.2:6868/peaks")
      .then((res) => res.json())
      .then((json) => setPeaks(json.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (clickedPoints.length < 2) {
      setRouteGeoJson(null);
      return;
    }

    const pointsPayload = clickedPoints.map((point) => ({
      lat: point.coords[1],
      lng: point.coords[0],
    }));

    const fetchLocalRoute = async () => {
      try {
        const res = await fetch("http://10.0.2.2:6868/routing/local", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ points: pointsPayload, routeType }),
        });
        if (!res.ok) {
          console.error("Błąd w odpowiedzi backendu:", res.status);
          setRouteGeoJson(null);
          return;
        }
        const data = await res.json();
        setRouteGeoJson(data);
      } catch (error) {
        console.error("Błąd fetch:", error);
        setRouteGeoJson(null);
      }
    };

    fetchLocalRoute();
  }, [clickedPoints, routeType]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} logoEnabled={false} onPress={handlePress}>
        <Camera
          defaultSettings={{
            centerCoordinate: [19.945, 49.299],
            zoomLevel: 12,
          }}
        />

        <RasterSource
          id="base"
          tileSize={512}
          tileUrlTemplates={[
            `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
          ]}
        >
          <RasterLayer id="baseLayer" sourceID="base" />
        </RasterSource>

        {shelters.map((shelter) => (
          <ShapeSource
            key={`shelter-${shelter.id}`}
            id={`shelter-source-${shelter.id}`}
            onPress={() => handleShelterPress(shelter)}
            shape={{
              type: "Feature",
              properties: { name: shelter.name },
              geometry: {
                type: "Point",
                coordinates: [shelter.longitude, shelter.latitude],
              },
            }}
          >
            <CircleLayer
              id={`shelter-circle-${shelter.id}`}
              style={{
                circleRadius: 5,
                circleColor: "#ef4444",
                circleStrokeWidth: 2,
                circleStrokeColor: "#ffffff",
              }}
            />
          </ShapeSource>
        ))}
        {peaks.map((peak) => (
          <ShapeSource
            key={`peak-${peak.id}`}
            id={`peak-source-${peak.id}`}
            onPress={() => handlePeakPress(peak)}
            shape={{
              type: "Feature",
              properties: { name: peak.name },
              geometry: {
                type: "Point",
                coordinates: [peak.longitude, peak.latitude],
              },
            }}
          >
            <CircleLayer
              id={`peak-circle-${peak.id}`}
              style={{
                circleRadius: 5,
                circleColor: "#2563eb",
                circleStrokeWidth: 2,
                circleStrokeColor: "#ffffff",
              }}
            />
          </ShapeSource>
        ))}

        {clickedPoints.map((p, i) => (
          <ShapeSource
            key={`point-${i}`}
            id={`point-source-${i}`}
            shape={{
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: p.coords,
              },
            }}
          >
            <CircleLayer
              id={`point-circle-${i}`}
              style={{
                circleRadius: 7,
                circleColor: "#9333ea",
                circleStrokeWidth: 3,
                circleStrokeColor: "#ffffff",
              }}
            />
          </ShapeSource>
        ))}

        {routeGeoJson && (
          <ShapeSource id="route" shape={routeGeoJson}>
            <LineLayer
              id="route-line"
              style={{
                lineColor: "#9333ea",
                lineWidth: 4,
                lineJoin: "round",
                lineCap: "round",
              }}
            />
          </ShapeSource>
        )}
      </MapView>

      <ModalShelterPeak
        visible={selectedFeature !== null}
        selectedFeature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
        onAddToRoute={(coords, name) => {
          setClickedPoints((prev) => [...prev, { coords, name }]);
        }}
      />

      <RouteBottomSheet
        ref={bottomSheetRef}
        clickedPoints={clickedPoints}
        routeGeoJson={routeGeoJson}
        saving={saving}
        onClearRoute={() => {
          setClickedPoints([]);
          setRouteGeoJson(null);
          bottomSheetRef.current?.close();
        }}
        onRemovePoint={(index) => {
          setClickedPoints((prev) => prev.filter((_, i) => i !== index));
        }}
        onSaveRoute={async (routeData) => {
          console.log("Zapisywanie trasy:", routeData);

          if (!currentUser?.id) {
            Alert.alert("Błąd", "Musisz być zalogowany, aby zapisać trasę");
            return;
          }

          if (saving) return;
          setSaving(true);

          try {
            const coordinates =
              routeData.geometry?.features?.[0]?.geometry?.coordinates || [];

            const difficulty = routeData.difficulty || "Średnia";

            const points = routeData.points.map(
              (
                p: { coords: [number, number]; name?: string },
                index: number,
              ) => ({
                coordinates: [p.coords[1], p.coords[0]],
                name: p.name || `Punkt ${index + 1}`,
                point_order: index,
              }),
            );

            const trailPayload = {
              name: routeData.name,
              description: `Trasa utworzona przez planera tras`,
              difficulty: difficulty,
              length_km: routeData.stats.distance / 1000,
              elevation_gain: routeData.stats.elevationGain,
              region: routeData.region,
              route_type: routeData.routeType,
              geometry: {
                type: "LineString",
                coordinates: coordinates,
              },
              created_by: currentUser.id.toString(),
              duration_minutes: routeData.stats.duration,
              public: false,
              points: points,
            };

            const response = await trailsService.createTrail(trailPayload);

            if (response.status === 201) {
              const newTrailId =
                response.data?.data?.id ||
                response.data?.id ||
                response.data?.trail?.id;

              if (
                newTrailId &&
                routeData.features &&
                routeData.features.length > 0
              ) {
                try {
                  const featureIds = routeData.features.map((id: string) =>
                    parseInt(id),
                  );
                  await FeaturesListService.updateTrailFeatures(
                    newTrailId,
                    featureIds,
                  );
                } catch (featError) {
                  console.error("Błąd zapisywania cech:", featError);
                }
              }

              Alert.alert("Sukces", "Trasa została zapisana pomyślnie!", [
                {
                  text: "OK",
                  onPress: () => {
                    setClickedPoints([]);
                    setRouteGeoJson(null);
                    bottomSheetRef.current?.resetForm();
                    bottomSheetRef.current?.close();
                  },
                },
              ]);
            }
          } catch (error: any) {
            console.error("Błąd zapisywania trasy:", error);
            Alert.alert(
              "Błąd",
              error.response?.data?.message || "Nie udało się zapisać trasy",
            );
          } finally {
            setSaving(false);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default MapScreen;
