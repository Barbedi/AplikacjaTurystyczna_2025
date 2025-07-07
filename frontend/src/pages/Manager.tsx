import { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardMenu from "../components/Manager/DashboardMenu";
import MenuBarTop from "../components/Manager/MenuBarTop";
import AuthContext from "../store/auth-context";

const Manager = () => {
  const navigate = useNavigate();
  const { checkAuth } = useContext(AuthContext);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    checkAuth().then((auth) => {
      if (!auth) {
        navigate("/logowanie");
      }
    });
  }, [checkAuth, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-grad1 to-grad2">
      <div className="flex flex-row min-h-screen relative">
        <div className="relative h-auto min-h-screen border-r-2 border-white">
          <DashboardMenu title={title} setTitle={setTitle} />
        </div>
        <div className="flex-1 flex flex-col">
          <MenuBarTop />
          <div className="flex-1 p-4 overflow-x-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manager;
