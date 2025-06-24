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
    <header className="w-full bg-nav bg-opacity-70 font-lora px-4 py-3 fixed top-0 left-0 z-30">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-white font-bold text-4xl">
            HikeUp
          </Link>
        </div>
        <nav className="hidden md:flex space-x-3 text-xl ">
          <NavLink
  to="/"
  className={({ isActive }) =>
    `text-white text-xl py-2 px-4 hover:text-gray-300 ${isActive ? "border-b-2 border-white" : ""}`
  }
  onClick={() => setMenuOpen(false)}
>
  Strona główna
</NavLink>

<NavLink
  to="/plan-route"
  className={({ isActive }) =>
    `text-white text-xl py-2 px-4 hover:text-gray-300 ${isActive ? "border-b-2 border-white" : ""}`
  }
  onClick={() => setMenuOpen(false)}
>
  Zaplanuj trasę
</NavLink>

<NavLink
  to="/discover"
  className={({ isActive }) =>
    `text-white text-xl py-2 px-4 hover:text-gray-300 ${isActive ? "border-b-2 border-white" : ""}`
  }
  onClick={() => setMenuOpen(false)}
>
  Odkryj trasy
</NavLink>
        </nav>
        <div className="hidden md:flex items-center space-x-4 text-xl">
          {auth ? (
            <>
              <NavLink
                to="/dashboard"
                className="text-white py-2 px-4 hover:text-gray-300"
              >
                Panel
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-white py-2 px-4 hover:text-gray-300"
              >
                Wyloguj się
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="text-white py-2 px-4 hover:text-gray-300"
            >
              Zaloguj się
            </NavLink>
          )}
        </div>
        <button
          onClick={toggleMenu}
          className="text-white text-3xl md:hidden focus:outline-none"
          aria-label="Przełącz menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-nav bg-opacity-90 mt-2 space-y-2 py-4">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-white text-xl hover:text-gray-300"
          >
            Strona główna
          </NavLink>
          <NavLink
            to="/plan-route"
            onClick={() => setMenuOpen(false)}
            className="text-white text-xl hover:text-gray-300"
          >
            Zaplanuj trasę
          </NavLink>
          <NavLink
            to="/discover"
            onClick={() => setMenuOpen(false)}
            className="text-white text-xl hover:text-gray-300"
          >
            Odkryj trasy
          </NavLink>
          {auth ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-white text-xl hover:text-gray-300"
              >
                Panel
              </NavLink>
              <button
                onClick={async () => {
                  await handleLogout();
                  setMenuOpen(false);
                }}
                className="text-white text-xl hover:text-gray-300"
              >
                Wyloguj się
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-white text-xl hover:text-gray-300"
            >
              Zaloguj się
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
