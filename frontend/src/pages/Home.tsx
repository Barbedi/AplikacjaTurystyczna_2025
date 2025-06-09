import Navbar from "../components/Navbar";
import PlanRoute from "../components/PlanRoute";
import ProposedRoutes from "../components/ProposedRoutes";
import ExploreRoutes from "../components/ExploreRoutes";

const Home = () => {
  return (
    <div className="bg-background/90">
      <Navbar />
      <PlanRoute />
      <ProposedRoutes />
      <ExploreRoutes />
    </div>
  );
};
export default Home;
