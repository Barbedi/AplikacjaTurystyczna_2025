import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system/legacy";
import { TASK_NAME } from "../tasks/gpsTracking";
import { TrackingService } from "../services/tracking.service";

export function useRouteRecorder() {
  const startRecording = async (userId: number, name: string) => {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== "granted") {
      console.log("Foreground permission not granted");
      return;
    }

    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== "granted") {
      console.log("Background permission not granted");
      return;
    }

    // Initialize local files
    const fileUri = FileSystem.documentDirectory + "current_route.json";
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([]));
    
    const bufferUri = FileSystem.documentDirectory + "upload_buffer.json";
    await FileSystem.writeAsStringAsync(bufferUri, JSON.stringify([]));

    // Create route on backend immediately
    const routeId = await TrackingService.createRoute(userId, name);
    await SecureStore.setItemAsync("active_route_id", String(routeId));

    await Location.startLocationUpdatesAsync(TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 5, // 5 meters
      timeInterval: 2500, // 2.5 seconds
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Nagrywanie trasy",
        notificationBody: "Twoja trasa jest nagrywana w tle",
      },
    });

    return true;
  };

  const stopRecording = async () => {
    await Location.stopLocationUpdatesAsync(TASK_NAME);

    // Flush remaining buffer
    const bufferUri = FileSystem.documentDirectory + "upload_buffer.json";
    if (await FileSystem.getInfoAsync(bufferUri).then(i => i.exists)) {
      const content = await FileSystem.readAsStringAsync(bufferUri);
      const bufferPoints = JSON.parse(content);
      if (bufferPoints.length > 0) {
        const routeId = await SecureStore.getItemAsync("active_route_id");
        if (routeId) {
           try {
             await TrackingService.sendPoints(Number(routeId), bufferPoints);
             console.log(`[Recorder] Flushed ${bufferPoints.length} points on stop.`);
           } catch (e) {
             console.error("[Recorder] Failed to flush buffer on stop:", e);
           }
        }
      }
    }

    // Finish route on backend
    const routeId = await SecureStore.getItemAsync("active_route_id");
    if (routeId) {
      await TrackingService.finishRoute(Number(routeId));
      await SecureStore.deleteItemAsync("active_route_id");
    }

    // Return local summary for display
    const fileUri = FileSystem.documentDirectory + "current_route.json";
    let points = [];
    if (await FileSystem.getInfoAsync(fileUri).then(i => i.exists)) {
        const content = await FileSystem.readAsStringAsync(fileUri);
        points = JSON.parse(content);
    }

    // Calculate summary locally
    let distance = 0;
    let elevationGain = 0;
    let elevationLoss = 0;

    if (points.length > 1) {
        for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];
            
            // Haversine distance
            const R = 6371e3; // metres
            const φ1 = p1.lat * Math.PI/180;
            const φ2 = p2.lat * Math.PI/180;
            const Δφ = (p2.lat-p1.lat) * Math.PI/180;
            const Δλ = (p2.lon-p1.lon) * Math.PI/180;

            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                      Math.cos(φ1) * Math.cos(φ2) *
                      Math.sin(Δλ/2) * Math.sin(Δλ/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            distance += R * c;

            // Elevation
            const diff = p2.altitude - p1.altitude;
            if (diff > 0) elevationGain += diff;
            else elevationLoss += Math.abs(diff);
        }
    }

    let duration = 0;
    if (points.length > 0) {
        duration = points[points.length - 1].ts - points[0].ts;
    }

    const avgSpeed = duration > 0 ? (distance / 1000) / (duration / 1000 / 3600) : 0;

    return {
        distance,
        elevation_gain: elevationGain,
        elevation_loss: elevationLoss,
        points_count: points.length,
        duration,
        avg_speed: avgSpeed
    };
  };

  return { startRecording, stopRecording };
}
