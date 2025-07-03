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
    <div className="min-h-screen bg-gradient-to-b from-grad1 to-grad2 pb-24 md:pb-0">
      <div className="flex flex-row">
        <div>
          <DashboardMenu title={title} setTitle={setTitle} />
        </div>
        <div className="w-full min-h-screen ">
          <MenuBarTop />
          <div className="flex  justify-center ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manager;
