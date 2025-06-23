import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_CLIENT_API_URL + "/",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});
