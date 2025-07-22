export interface Users {
  id?: number;
  email: string;
  password: string;
  name: string;
  level_of_experience?: string;
  fitness_level?: string;
  created_at?: string;
  salt?: string;
  role?: string;
}
export interface UserInfo {
  id?: number;
  email: string;
  password: string;
  name: string;
  level_of_experience?: string;
  fitness_level?: string;
  created_at?: string;
  salt?: string;
  role?: string;
  profile_image?: string;
}

export interface Trails {
  id: number;
  name: string;
  description: string;
  difficulty: string;
  length_km: number;
  elevation_gain: number;
  region: string;
  route_type: "one-way" | "loop" | "back-and-forth";
  geometry: {
    type: string;
    coordinates: number[][];
  };
  created_by: string;
  created_at: string;
  points?: TrailPoint[];
  duration_minutes?: number;
}
export interface FavoriteTrails {
  user_id: number;
  trail_id: number;
  added_at: string;
}

interface ExtendedTrail extends Trails {
  photos?: {
    id: number;
    trail_id: number;
    image_name: string;
    created_at: string;
  }[];
}
export interface UserPeak {
  peak_id: number;
  peak_name: string;
  user_id: number;
  visited_at: string;
  times_visited: number;
  last_visited: string;
  description?: string;
  photo_url?: string;
}

export type NewTrail = Omit<Trails, "id" | "created_at" | "points">;

export interface TrailPoint {
  id: number;
  trail_id: number;
  lat: number;
  lng: number;
  name?: string;
  point_order: number;
}

export interface User {
  exp: number;
  iat: number;
  email: string;
  role: string;
}
export interface UserPeaks {
  id: number;
  user_id: number;
  peak_id: number;
  visited_at: string;
  photo_url?: string;
  description?: string;
}

export interface Peaks {
  id: number;
  name: string;
  elevation: number;
  region: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  image_filename: string;
}
export interface RoutePoint {
  coordinates: [number, number];
  name?: string;
  type?: "peak" | "shelter" | "custom";
  id?: number;
}

export interface RouteInfo {
  name: string;
  type: "one-way" | "loop" | "back-and-forth";
  points: RoutePoint[];
  description?: string;
}

export interface Shelters {
  id: number;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  altitude: number;
  photo?: string;
  mountain_range: string;
}
interface routeTrail {
  type: string;
  features: {
    type: string;
    geometry: {
      coordinates: number[][][];
    };
    properties: {
      id: string;
      summary: {
        distance: number;
        duration: number;
      };
      segments: {
        distance: number;
        duration: number;
        steps: {
          distance: number;
          duration: number;
          type: number;
          instruction: string;
          name?: string;
          way_points: number[];
        }[];
      }[];
      elevation: number[];
    };
    geometry: {
      type: string;
      coordinates: number[][];
    };
  }[];
}

// Typ dla odpowiedzi z paginacją
export interface TrailsResponse {
  data: Trails[];
  message: string;
  totalPages: number;
  page: number;
  limit: number;
}

export interface PeakCollection {
  id: number;
  name: string;
  description: string;
}
interface PageData {
  page: number;
  pages: number;
}
export interface Peaks {
  id: number;
  name: string;
  elevation: number;
  region: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  description?: string;
  image_filename?: string;
}

export interface CurrentWeather {
  name: string;
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  sys: {
    sunset: number;
    sunrise: number;
  };
  wind: {
    speed: number;
  };
}

export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    main: string;
    icon: string;
    description: string;
  }[];
}
interface Filter {
  by: string;
  operator?: string;
  value: string | string[];
}

interface Sort {
  by: string[];
  order?: string;
}

interface Err extends Error {
  response: {
    status: number;
    data: {
      message: string;
    };
  };
}
