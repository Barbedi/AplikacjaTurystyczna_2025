import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";
import DashboardMenu from "../components/DashboardMenu";
import MenuBarTop from "../components/MenuBarTop";
import WeatherWidget from "../components/WeatherWidget";

const Dashboard = () => {
  const { checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    checkAuth().then((isAuth) => {
      console.log("Zalogowany?", isAuth);
      if (!isAuth) {
        navigate("/login");
      }
      setLoading(false);
    });
  }, [checkAuth, navigate]);

  if (loading) {
    return <p className="text-center mt-10">Sprawdzanie autoryzacji...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-grad1 to-grad2 pb-24 md:pb-0">
      <div className="flex flex-row">
        <div>
          <DashboardMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <div className="w-full">
          <MenuBarTop />
          <div className="flex flex-col items-center justify-center mt-4 mx-6">
            <WeatherWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
