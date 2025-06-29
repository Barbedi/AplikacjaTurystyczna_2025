import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import WeatherWidget from "../../components/WeatherWidget";

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
    <div className="w-full flex flex-col items-center justify-center mt-4 mx-6">
      <WeatherWidget />
    </div>
  );
};

export default Dashboard;
