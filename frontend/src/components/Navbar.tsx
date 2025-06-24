import { useState, useEffect, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import AuthContext from "../store/auth-context";



const Navbar = () => {
  const { auth, checkAuth, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Error during authentication check:", error);
      }
    })();
  }, [checkAuth]);

  
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      
      {/* Navigation */}
      <header className="absolute top-0 left-0 w-full bg-nav bg-opacity-70 font-lora p-4 z-30">
        <div className="flex items-center justify-between">
          <Link to="/" className="pl-4">
            <span className="font-bold text-white text-4xl">HikeUp</span>
          </Link>

          <button
            onClick={toggleMenu}
            className="text-white text-3xl md:hidden pr-4 focus:outline-none"
            aria-label="Przełącz menu"
          >
            ☰
          </button>

          <nav
            className={`${
              menuOpen ? "flex" : "hidden"
            } flex-col md:flex md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 pr-4`}
          >
            <NavLink
              to="/plan-route"
              className="text-white text-xl hover:text-gray-300 transition duration-300 hover:border-2 rounded-2xl p-1"
            >
              Zaplanuj trasę
            </NavLink>

            {auth ? (
              <>
                <NavLink
                  to="/dashboard"
                  className="text-white text-xl hover:text-gray-300 transition duration-300 hover:border-2 rounded-2xl p-1"
                >
                  Panel
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-white text-xl hover:text-gray-300 transition duration-300 hover:border-2 rounded-2xl p-1"
                >
                  Wyloguj się
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="text-white text-xl hover:text-gray-300 transition duration-300 hover:border-2 rounded-2xl p-1"
              >
                Zaloguj się
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      
    </div>
  );
};

export default Navbar;
