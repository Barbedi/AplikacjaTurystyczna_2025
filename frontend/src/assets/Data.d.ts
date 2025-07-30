// ===================== USERS =====================
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
  profile_image?: string;
}

export interface User {
  exp: number;
  iat: number;
  email: string;
  role: string;
}

export interface User_Activities {
  id: number;
  user_id: number;
  action_type: string;
  target_id: number;
  target_name: string;
  created_at: string;
}

// ===================== TRAILS =====================
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

export type NewTrail = Omit<Trails, "id" | "created_at" | "points">;

export interface TrailPoint {
  id: number;
  trail_id: number;
  lat: number;
  lng: number;
  name?: string;
  point_order: number;
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

// ===================== COMMUNITY TRAILS & COMMENTS =====================
export interface CommunityTrails {
  shared_id: number;
  user_id: number;
  trail_id: number;
  description: string;
  created_at: string;
}

interface ExtendedCommunityTrails extends CommunityTrails {
  user_name: string;
  user_profile_image?: string;
  trail_name: string;
  shared_description: string;
}

export interface TrailLike {
  id: number;
  user_id: number;
  shared_trail_id: number;
  created_at: string;
}

export interface CommentShared {
  id?: number;
  shared_trail_id: number;
  user_id: number;
  content: string;
  parent_id?: number;
  created_at?: string;
  user?: {
    id: number;
    name: string;
    profile_image?: string;
  };
}

// ===================== PEAKS =====================
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

export interface PeakCollection {
  id: number;
  name: string;
  description: string;
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

export interface UserPeaks {
  id: number;
  user_id: number;
  peak_id: number;
  visited_at: string;
  photo_url?: string;
  description?: string;
}

// ===================== SHELTERS =====================
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
// ===================== REVIEWS =====================
export interface Review {
  id?: number;
  user_id: number;
  user_name?: string;
  trail_id?: number;
  peak_id?: number;
  rating?: number;
  comment: string;
  created_at?: string;
  peak_name?: string;
  trail_name?: string;
}
// ===================== Statistics ======================
export interface Statistics {
  crowns: {
    kgp: {
      visited: number;
      all: number;
      percent: number;
    };
    kbs: {
      visited: number;
      all: number;
      percent: number;
    };
  };
  longestTrail: {
    name: string;
    length_km: number;
  } | null;
  highestPeak: {
    name: string;
    elevation: number;
  } | null;
  lastPeak: {
    name: string;
    created_at: string;
  } | null;
  allUserPeaks: number;
  allUserTrails: number;
  allUserTrailsShared: number;
}

// ===================== ROUTES =====================
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

export interface RouteTrail {
  type: string;
  features: {
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number][];
    };
    properties: {
      distance: number;
      nodes: number;
    };
  }[];
}


// ===================== WEATHER =====================
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

// ===================== PAGINATION =====================
export interface TrailsResponse {
  data: Trails[];
  message: string;
  totalPages: number;
  page: number;
  limit: number;
}

interface PageData {
  page: number;
  pages: number;
}

// ===================== FILTERS & SORT =====================
interface Filter {
  by: string;
  operator?: string;
  value: string | string[];
}

interface Sort {
  by: string[];
  order?: string;
}

// ===================== ERROR =====================
interface Err extends Error {
  response: {
    status: number;
    data: {
      message: string;
    };
  };
}
