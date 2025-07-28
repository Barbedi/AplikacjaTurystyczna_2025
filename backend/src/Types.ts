interface ErrInterface {
  message: string;
  statusCode?: number | undefined;
  stack?: string;
}

interface Users {
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

interface PeakCollection {
  id: number;
  name: string;
  description: string;
}

interface Peaks {
  id: number;
  name: string;
  elevation: number;
  region: string;
  latitude: number;
  longitude: number;
  verified?: boolean;
  image_filename?: string;
}
interface UserPeaks {
  id: number;
  user_id: number;
  peak_id: number;
  visited_at: string;
  photo_url?: string;
  description?: string;
}
interface FavoriteTrails {
  user_id: number;
  trail_id: number;
  added_at: string;
}
interface CommunityTrails {
  id: number;
  user_id: number;
  trail_id: number;
  description: string;
  created_at: string;
}
interface TrailLike {
  id: number;
  user_id: number;
  shared_trail_id: number;
  created_at: string;
}

interface Photo {
  id: number;
  trail_id: number;
  image_name: string;
  created_at: string;
}
interface CommentShared {
  id: number;
  shared_trail_id: number;
  user_id: number;
  content: string;
  parent_id?: number;
  created_at: string;
  user?: {
    id: number;
    name: string;
    profile_image?: string;
  };
}
interface Review {
  id?: number;
  user_id: number;
  trail_id?: number;
  peak_id?: number;
  rating: number;
  comment: string;
  created_at?: string;
}

interface Trails {
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
  photos?: Photo[];
  duration_minutes: number;
  public: boolean;
}

interface TrailPoint {
  id: number;
  trail_id: number;
  lat: number;
  lng: number;
  name?: string;
  point_order: number;
}
export class Err implements ErrInterface {
  constructor(message: string, statusCode?: number) {
    this.message = message;
    this.statusCode = statusCode;
  }
  message: string;
  statusCode?: number | undefined;
  stack?: string;
}

export type {
  ErrInterface,
  Users,
  PeakCollection,
  Peaks,
  Trails,
  TrailPoint,
  UserPeaks,
  FavoriteTrails,
  Photo,
  CommunityTrails,
  TrailLike,
  CommentShared,
  Review,
};
