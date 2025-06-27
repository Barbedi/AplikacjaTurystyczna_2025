import AuthContext from "../store/auth-context";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface DashboardMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const DashboardMenu: React.FC<DashboardMenuProps> = ({ isOpen, setIsOpen }) => {
  const { checkAuth, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [, setLoading] = useState(true);

  useEffect(() => {
    checkAuth().then((isAuth) => {
      console.log("Zalogowany?", isAuth);
      if (!isAuth) {
        navigate("/login");
      }
      setLoading(false);
    });
  }, []);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isOpen ? "md:w-70 w-80" : "w-16"
      } h-screen border-r-2 border-white items-start justify-between  bg-transparent/30 relative`}
    >
      {/* Menu content */}
      <div className={`p-4 ${!isOpen && "px-2"}`}>
        <div className="flex items-center">
          <img
            className="rounded-full h-10 w-10 object-cover"
            src="/assets/img/FullSizeRender.JPG"
            alt="user"
          />
          {isOpen && (
            <h2 className="text-white md:text-sm 2xl:text-lg font-bold ml-4">
              {user?.email}
            </h2>
          )}
        </div>

        <div className="flex flex-col md:mt-2 mt-6 w-full space-y-2 md:space-y-1">
          <span className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left">
          {isOpen && "DASHBOARDS"}
          </span>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            {isOpen && "Zaplanuj trase"}
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            {isOpen && "Wyszukaj szlaku"}
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            {isOpen && "Moje trasy"}
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            {isOpen && "Ulubione trasy"}
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            {isOpen && "Proponowane trasy"}
          </button>
        </div>
        <div className="flex flex-col md:mt-2 mt-6 w-full md:space-y-1 space-y-2">
          <span className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left">
          {isOpen && "Postępy"}
          </span>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            {isOpen && "Moje szczyty"}
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            {isOpen && "Korony Gór"}
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            {isOpen && "Statystyki"}
          </button>
        </div>
        <div className="flex flex-col md:mt-2 mt-6 w-full md:space-y-1 space-y-2">
          <span className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left">
          {isOpen && "Ustawienia"} 
          </span>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            {isOpen && "Moj profil"}
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            {isOpen && "Moje opinie"}
          </button>
          <button className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm" />
            {isOpen && "Wyloguj"}
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 w-full md:py-3 py-6">
        <Link to="/" className="block text-center text-white text-4xl font-bold">
        {isOpen && "HikeUp"}
        </Link>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-4 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent/80 transition-colors"
      >
        <span className="text-xs">{isOpen ? "‹" : "›"}</span>
      </button>
    </div>
  );
};

export default DashboardMenu;
