import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context"; // lub odpowiednia ścieżka
import DashboardMenu from "../components/DashboardMenu";
import MenuBarTop from "../components/MenuBarTop";

const Dashboard = () => {
  const { checkAuth, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth().then((isAuth) => {
      console.log("Zalogowany?", isAuth); // true/false
      if (!isAuth) {
        navigate("/login"); // przekieruj jeśli nie zalogowany
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Sprawdzanie autoryzacji...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-grad1 to-grad2 pb-24 md:pb-0">
      <div className="flex flex-row">
        <div>
          <DashboardMenu />
        </div>
        <div className="w-full">
  <MenuBarTop />
</div>


      </div>

    </div>
  );
};

export default Dashboard;
