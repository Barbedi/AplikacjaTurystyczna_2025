import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import WeatherWidget from "../../components/Manager/Dashboard/WeatherWidget";
import MapPlanner from "../../components/Manager/Map/MapPlanner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faParking, faTree } from "@fortawesome/free-solid-svg-icons";

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
        <div className="relative w-full md:w-1/2 min-h-96 rounded-2xl overflow-hidden ">
          <MapPlanner />
          <div
            className="absolute inset-0 z-[999] flex items-center justify-center cursor-pointer bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 transition hover:bg-white/30 border border-blue-100"
            onClick={() => navigate("plan-route")}
          >
            <span className="text-2xl font-semibold text-purple-700 drop-shadow-md select-none">
              Kliknij tutaj, aby zaplanować trasę
            </span>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4 p-4">
          <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl  border border-blue-100 hover:scale-105 transition-transform duration-300">
            <div className="w-13 h-13 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FontAwesomeIcon
                icon={faParking}
                className=" text-2xl text-blue-600"
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Kup bilety na parking
            </h2>
            <p className="text-white text-center text-sm mb-4">
              Zostaniesz przekierowany na stronę zakupu biletów.
            </p>
            <a
              href="https://tpn.gov.pl/parkingi-morskie-oko"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Kup bilety
            </a>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl  border border-green-100 hover:scale-105 transition-transform duration-300">
            <div className="w-13 h-13 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FontAwesomeIcon
                icon={faTree}
                className=" text-2xl text-green-600"
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Kup bilety do Parku Narodowego
            </h2>
            <p className="text-white text-center text-sm mb-4">
              Zostaniesz przekierowany na stronę zakupu biletów.
            </p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://tpn.gov.pl/wstep-do-parku"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Kup bilety
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
