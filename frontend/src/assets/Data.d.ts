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

export interface User {
  exp: number;
  iat: number;
  email: string;
  role: string;
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
