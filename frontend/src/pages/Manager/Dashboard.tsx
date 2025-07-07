import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import WeatherWidget from "../../components/Manager/WeatherWidget";
import MapPlanner from "../../components/Manager/MapPlanner";

const Dashboard = () => {
  const { checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then((isAuth) => {
      if (!isAuth) {
        navigate("/login");
      }
    });
  }, [checkAuth, navigate]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center mt-4">
      <div className="w-full mb-4 overflow-x-hidden ">
        <WeatherWidget />
      </div>
      <div className="w-full flex flex-row">
        <div className="relative w-full md:w-1/2 min-h-96 ">
          <MapPlanner />
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer "
            onClick={() => navigate("plan-route")}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
