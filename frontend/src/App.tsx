import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TrailsPublic from "./pages/TrailsPublic";
import Dashboard from "./pages/Manager/Dashboard";
import ErrorBoundary from "./pages/ErrorBoundary";
import PlanRoute from "./pages/Manager/PlanRoute";
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
import CrownPolandPage from "./pages/Manager/CrownPolandPage";
import CrownBeskidPage from "./pages/Manager/CrownBeskidPage";
import EditCrownPage from "./pages/Manager/EditCrownPage";
import EditTrailPage from "./pages/Manager/TrailPage";

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
      <Route path="trails">
        <Route index element={<TrailsPublic />} />
        <Route path=":id" element={<TrailsPublic />} />
      </Route>
      <Route path="dashboard" element={<Manager />}>
        <Route index element={<Dashboard />} />
        <Route path="plan-route" element={<PlanRoute />} />
        <Route path="edit-route/:id" element={<PlanRoute />} />
        <Route path="my-profile" element={<MyProfile />} />
        <Route path="my-routes">
          <Route index element={<MyRoutes />} />
          <Route path=":id" element={<EditTrailPage />} />
        </Route>
        <Route path="my-peaks">
          <Route index element={<MyPeaks />} />
          <Route path=":id" element={<EditCrownPage />} />
        </Route>
        <Route path="my-reviews" element={<MyReviews />} />
        <Route path="crown-peaks">
          <Route index element={<CrownPeaks />} />
          <Route path="crown-poland">
            <Route index element={<CrownPolandPage />} />
            <Route path=":id" element={<EditCrownPage />} />
          </Route>
          <Route path="crown-beskid">
            <Route index element={<CrownBeskidPage />} />
            <Route path=":id" element={<EditCrownPage />} />
          </Route>
        </Route>

        <Route path="recommended">
          <Route index element={<Recommended />} />
          <Route path=":id" element={<EditTrailPage />} />
        </Route>
        <Route path="favorite-routes" element={<FavoriteRoutes />} />
        <Route path="search-trail" element={<SearchTrail />} />
        <Route path="statistics" element={<Statistics />} />
      </Route>
      <Route path="discover" element={<Discover />} />
    </Routes>
  );
}
