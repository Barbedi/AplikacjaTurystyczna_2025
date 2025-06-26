import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ErrorBoundary from "./pages/ErrorBoundary";
import PlanRoute from "./pages/PlanRoute";
import Discover from "./pages/Discover";

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
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="plan-route" element={<PlanRoute />} />
      <Route path="discover" element={<Discover />} />
    </Routes>
  );
}
