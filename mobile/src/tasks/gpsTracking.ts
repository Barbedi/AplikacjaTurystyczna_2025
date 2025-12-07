import * as TaskManager from "expo-task-manager";
import { TrackingService } from "../services/tracking.service";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system/legacy";

export const TASK_NAME = "GPS_TRACKING";
const BATCH_INTERVAL = 10000; // 10 seconds
const MIN_ACCURACY = 20; // meters
const MAX_SPEED_KMH = 120; // km/h (to filter GPS jumps)

let lastUploadTime = 0;
let lastValidPoint: { lat: number; lon: number; ts: number } | null = null;

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  if (error) return;

  const { locations } = data as any;
  const loc = locations[0];
  if (!loc) return;

  // 1. Accuracy Filter
  if (loc.coords.accuracy > MIN_ACCURACY) {
    console.log(`[GPS] Ignored point due to poor accuracy: ${loc.coords.accuracy}m`);
    return;
  }

  const point = {
    lat: loc.coords.latitude,
    lon: loc.coords.longitude,
    altitude: loc.coords.altitude,
    ts: Date.now(),
  };

  // 2. Speed/Jump Filter
  if (lastValidPoint) {
    const distKm = getDistanceFromLatLonInKm(lastValidPoint.lat, lastValidPoint.lon, point.lat, point.lon);
    const timeDiffHours = (point.ts - lastValidPoint.ts) / 1000 / 3600;
    
    if (timeDiffHours > 0) {
      const speedKmh = distKm / timeDiffHours;
      if (speedKmh > MAX_SPEED_KMH) {
        console.log(`[GPS] Ignored point due to unrealistic speed: ${speedKmh.toFixed(2)} km/h`);
        return;
      }
    }
  }

  lastValidPoint = point;

  try {
    // 1. Save to full history (current_route.json)
    const historyUri = FileSystem.documentDirectory + "current_route.json";
    let historyPoints = [];
    if (await FileSystem.getInfoAsync(historyUri).then(i => i.exists)) {
      const content = await FileSystem.readAsStringAsync(historyUri);
      historyPoints = JSON.parse(content);
    }
    historyPoints.push(point);
    await FileSystem.writeAsStringAsync(historyUri, JSON.stringify(historyPoints));

    // 2. Save to upload buffer (upload_buffer.json)
    const bufferUri = FileSystem.documentDirectory + "upload_buffer.json";
    let bufferPoints = [];
    if (await FileSystem.getInfoAsync(bufferUri).then(i => i.exists)) {
      const content = await FileSystem.readAsStringAsync(bufferUri);
      bufferPoints = JSON.parse(content);
    }
    bufferPoints.push(point);
    await FileSystem.writeAsStringAsync(bufferUri, JSON.stringify(bufferPoints));

    console.log(`[GPS] Point saved. History: ${historyPoints.length}, Buffer: ${bufferPoints.length}`);

    // 3. Check if it's time to upload
    const now = Date.now();
    if (now - lastUploadTime > BATCH_INTERVAL && bufferPoints.length > 0) {
      const routeId = await SecureStore.getItemAsync("active_route_id");
      if (routeId) {
        console.log(`[GPS] Uploading batch of ${bufferPoints.length} points...`);
        try {
          await TrackingService.sendPoints(Number(routeId), bufferPoints);
          // Clear buffer on success
          await FileSystem.writeAsStringAsync(bufferUri, JSON.stringify([]));
          lastUploadTime = now;
          console.log(`[GPS] Batch upload successful.`);
        } catch (uploadErr) {
          console.error(`[GPS] Batch upload failed, keeping points in buffer:`, uploadErr);
        }
      }
    }
  } catch (err) {
    console.error(`[GPS] Error in tracking task:`, err);
  }
});
