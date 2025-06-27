import AuthContext from "../store/auth-context";
import { useContext, useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const DashboardMenu = () => {
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
  return (
    <div className="flex flex-col items-start justify-between h-screen md:w-70 w-80 border-r-2 border-white bg-transparent/30 relative">
      <div className="flex-1 w-full p-4 overflow-hidden">
        {/* Profil */}
        <div className="flex items-center">
          <img
            className="rounded-full h-10 w-10 object-cover"
            src="/assets/img/FullSizeRender.JPG"
            alt="user"
          />
          <h2 className="text-white md:text-sm 2xl:text-lg font-bold ml-4">{user?.email}</h2>
        </div>

        {/* Menu */}
        <div className="flex flex-col md:mt-2  mt-6 w-full space-y-2 md:space-y-1">
          <span className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left">
            DASHBOARDS
          </span>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            Zaplanuj trase
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            Wyszukaj szlaku
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            Moje trasy
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            Ulubione trasy
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            Proponowane trasy
          </button>
        </div>
        <div className="flex flex-col md:mt-2  mt-6 w-full md:space-y-1 space-y-2">
          <span className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left">
          Postępy
          </span>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            Moje szczyty
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            Korony Gór
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            Statystyki
          </button>
        </div>
        <div className="flex flex-col md:mt-2  mt-6 w-full md:space-y-1 space-y-2">
          <span className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left">
            Ustawienia
          </span>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            Moj profil
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            Moje opinie
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            Wyloguj
          </button>
        </div>
      </div>
      <div className="w-full md:py-3 py-6">
        <Link to="/" className="block text-center text-white text-4xl font-bold">
          HikeUp
        </Link>
      </div>
    </div>
  );
};
export default DashboardMenu;
