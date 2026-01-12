import ExifReader from "exifreader";
import fs from "fs";

interface GPSData {
  latitude: number;
  longitude: number;
}

interface VerificationResult {
  verified: boolean;
  distance?: number;
  error?: string;
}


function dmsToDecimal(dmsArray: number[], ref: string): number {
  const degrees = dmsArray[0] || 0;
  const minutes = dmsArray[1] || 0;
  const seconds = dmsArray[2] || 0;
  
  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (ref === "S" || ref === "W") {
    decimal = -decimal;
  }
  
  return decimal;
}

export async function extractGPSFromImage(
  filePath: string,
): Promise<GPSData | null> {
  try {
    const buffer = fs.readFileSync(filePath);
    const tags = ExifReader.load(buffer);
    const gpsLatitude = tags.GPSLatitude;
    const gpsLongitude = tags.GPSLongitude;
    const gpsLatitudeRef = tags.GPSLatitudeRef;
    const gpsLongitudeRef = tags.GPSLongitudeRef;

    if (!gpsLatitude || !gpsLongitude || !gpsLatitudeRef || !gpsLongitudeRef) {
      return null;
    }
    const latArray = gpsLatitude.description;
    const lonArray = gpsLongitude.description;
    const latRef = (gpsLatitudeRef.value as string[])?.[0] || (gpsLatitudeRef.description as string);
    const lonRef = (gpsLongitudeRef.value as string[])?.[0] || (gpsLongitudeRef.description as string);
    let latitude: number;
    let longitude: number;

    if (typeof latArray === "string" && latArray.includes("°")) {
      const latParts = latArray.match(/(\d+)°\s*(\d+)'\s*([\d.]+)"/);
      const lonParts = (lonArray as string).match(/(\d+)°\s*(\d+)'\s*([\d.]+)"/);
      
      if (latParts && lonParts && latParts[1] && latParts[2] && latParts[3] && lonParts[1] && lonParts[2] && lonParts[3]) {
        latitude = dmsToDecimal(
          [parseFloat(latParts[1]), parseFloat(latParts[2]), parseFloat(latParts[3])],
          latRef
        );
        longitude = dmsToDecimal(
          [parseFloat(lonParts[1]), parseFloat(lonParts[2]), parseFloat(lonParts[3])],
          lonRef
        );
      } else {
        return null;
      }
    } else if (Array.isArray(latArray) && Array.isArray(lonArray)) {
      latitude = dmsToDecimal(latArray, latRef);
      longitude = dmsToDecimal(lonArray, lonRef);
    } else {
      latitude = parseFloat(latArray);
      longitude = parseFloat(lonArray);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return null;
      }
    }

    console.log(`📍 GPS extracted from image: lat=${latitude}, lon=${longitude}`);
    
    return {
      latitude,
      longitude,
    };
  } catch (error) {
    console.error("Error extracting GPS from image:", error);
    return null;
  }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; 
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
}

export async function verifyPeakPhoto(
  filePath: string,
  peakLat: number,
  peakLon: number,
  maxDistanceMeters: number = 1000,
): Promise<VerificationResult> {
  const gps = await extractGPSFromImage(filePath);

  if (!gps) {
    return {
      verified: false,
      error: "Brak danych GPS w zdjęciu",
    };
  }

  console.log(`🗺️ Calculating distance between:`);
  console.log(`   Photo GPS: lat=${gps.latitude}, lon=${gps.longitude}`);
  console.log(`   Peak GPS:  lat=${peakLat}, lon=${peakLon}`);
  
  const distance = calculateDistance(gps.latitude, gps.longitude, peakLat, peakLon);
  console.log(`📏 Distance: ${Math.round(distance)}m`);

  if (distance <= maxDistanceMeters) {
    return {
      verified: true,
      distance: Math.round(distance),
    };
  }

  return {
    verified: false,
    distance: Math.round(distance),
    error: `Zdjęcie zrobione ${Math.round(distance)}m od szczytu (max ${maxDistanceMeters}m)`,
  };
}
