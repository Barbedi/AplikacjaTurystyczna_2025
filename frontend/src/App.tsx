import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Manager/Dashboard";
import ErrorBoundary from "./pages/ErrorBoundary";
import PlanRoute from "./pages/PlanRoute";
import Discover from "./pages/Discover";
import Manager from "./pages/Manager";
import CrownPeaks from "./pages/Manager/CrownPeaks";
import MyRoutes from "./pages/Manager/MyRoutes";
import SearchTrail from "./pages/Manager/SearchTrail";
import Recommended from "./pages/Manager/Recommended";
import MyPeaks from "./pages/Manager/MyPeaks";
import MyReviews from "./pages/Manager/MyReviews";
import FavoriteRoutes from "./pages/Manager/FavoriteRoutes";
import MyProfile from "./pages/Manager/MyProfile";
import Statistics from "./pages/Manager/Statistics";

const router = createBrowserRouter([
  { path: "*", Component: Root, errorElement: <ErrorBoundary /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
function Root() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="plan-route" element={<PlanRoute />} />
      <Route path="dashboard" element={<Manager />}>
        <Route index element={<Dashboard />} />
        <Route path="plan-route" element={<PlanRoute />} />
        <Route path="my-profile" element={<MyProfile />} />
        <Route path="my-routes" element={<MyRoutes />} />
        <Route path="my-peaks" element={<MyPeaks />} />
        <Route path="my-reviews" element={<MyReviews />} />
        <Route path="crown-peaks" element={<CrownPeaks />} />
        <Route path="recommended" element={<Recommended />} />
        <Route path="favorite-routes" element={<FavoriteRoutes />} />
        <Route path="search-trail" element={<SearchTrail />} />
        <Route path="statistics" element={<Statistics />} />
      </Route>
      <Route path="discover" element={<Discover />} />
    </Routes>
  );
}
