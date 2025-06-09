import Navbar from "../components/Navbar";
import PlanRoute from "../components/PlanRoute";
import ProposedRoutes from "../components/ProposedRoutes";

const Home = () => {
  return (
    <div className="bg-background/90">
      <Navbar />
      <PlanRoute />
      <ProposedRoutes />
    </div>
  );
};
export default Home;
