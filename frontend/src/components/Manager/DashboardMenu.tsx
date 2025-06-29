import AuthContext from "../../store/auth-context";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link,NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faHouse,
  faRoute,
  faCompass,
  faLocationPinLock,
  faHeart,
  faMapLocationDot,
  faChartSimple,
  faMountainSun,
  faRankingStar,
  faGears,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import LogoutIcon from "@mui/icons-material/Logout";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import RateReviewIcon from "@mui/icons-material/RateReview";

interface DashboardMenuProps {
  title?: string;
  setTitle?: (title: string) => void;
}




const DashboardMenu: React.FC<DashboardMenuProps> = ( ) => {
  const { checkAuth, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [, setLoading] = useState(true);
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

  return (
    <div
      className={`relative transition-all duration-300 ${
        isOpen ? "md:w-70 w-80 2xl:w-74" : "w-20"
      } h-screen border-r-2 border-white items-start justify-between  bg-transparent/30 relative`}
    >
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
            <FontAwesomeIcon
              icon={faHouse}
              className="mr-2 text-sm 2xl:text-lg"
            />
            {isOpen && "DASHBOARDS"}
          </span>
            <NavLink
            to="plan-route"
            className={({ isActive }) =>
              `text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl transition duration-300 ${
              isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
            >
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mr-2 text-sm 2xl:text-lg"
              />
              <FontAwesomeIcon
                icon={faRoute}
                className="mr-2 text-sm 2xl:text-lg"
              />
              {isOpen && "Zaplanuj trase"}
            </div>
          </NavLink>
          <NavLink to="/" className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mr-2  text-sm 2xl:text-lg"
              />
              <FontAwesomeIcon
                icon={faCompass}
                className="mr-2 text-sm 2xl:text-lg"
              />
              {isOpen && "Wyszukaj szlaku"}
            </div>
          </NavLink>
          <NavLink to="/" className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mr-2 text-sm 2xl:text-lg"
              />
              <FontAwesomeIcon
                icon={faLocationPinLock}
                className="mr-2 text-sm 2xl:text-lg"
              />
              {isOpen && "Moje trasy"}
            </div>
          </NavLink>
          <NavLink to="/" className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mr-2 text-sm 2xl:text-lg"
              />
              <FontAwesomeIcon
                icon={faHeart}
                className="mr-2 text-sm 2xl:text-lg"
              />
              {isOpen && "Ulubione trasy"}
            </div>
          </NavLink>
          <NavLink to="/" className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mr-2 text-sm 2xl:text-lg"
              />
              <FontAwesomeIcon
                icon={faMapLocationDot}
                className="mr-2 text-sm 2xl:text-lg"
              />
              {isOpen && "Proponowane trasy"}
            </div>
          </NavLink>
        </div>
        <div className="flex flex-col md:mt-2 mt-6 w-full md:space-y-1 space-y-2">
          <span className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left">
            <FontAwesomeIcon
              icon={faChartSimple}
              className="mr-2 text-sm 2xl:text-lg"
            />
            {isOpen && "Postępy"}
          </span>
          <NavLink to="/" className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mr-2 text-sm 2xl:text-lg"
              />
              <PermMediaIcon className="mr-2 text-sm 2xl:text-lg" />
              {isOpen && "Moje szczyty"}
            </div>
          </NavLink>
          <NavLink to="/" className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mr-2 text-sm 2xl:text-lg"
              />
              <FontAwesomeIcon
                icon={faMountainSun}
                className="mr-2 text-sm 2xl:text-lg"
              />
              {isOpen && "Korony Gór"}
            </div>
          </NavLink>
          <NavLink to="/" className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mr-2 text-sm 2xl:text-lg"
              />
              <FontAwesomeIcon
                icon={faRankingStar}
                className="mr-2 text-sm 2xl:text-lg"
              />
              {isOpen && "Statystyki"}
            </div>
          </NavLink>
        </div>
        <div className="flex flex-col md:mt-2 mt-6 w-full md:space-y-1 space-y-2">
          <span className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left">
            <FontAwesomeIcon
              icon={faGears}
              className="mr-2 text-sm 2xl:text-lg"
            />
            {isOpen && "Ustawienia"}
          </span>
          <NavLink to="/" className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mr-2 text-sm 2xl:text-lg"
              />
              <FontAwesomeIcon
                icon={faCircleUser}
                className="mr-2 text-sm 2xl:text-lg"
              />
              {isOpen && "Moj profil"}
            </div>
          </NavLink>
          <NavLink to="/" className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mr-2 text-sm 2xl:text-lg"
              />
              <RateReviewIcon className="mr-2 text-sm 2xl:text-lg" />
              {isOpen && "Moje opinie"}
            </div>
          </NavLink>
          <NavLink to="/" className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-gray-700 transition duration-300">
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mr-2 text-sm 2xl:text-lg"
              />
              <LogoutIcon className="mr-2 text-sm 2xl:text-lg" />
              {isOpen && "Wyloguj"}
            </div>
          </NavLink>
        </div>
      </div>
      <div className="absolute bottom-0 w-full md:py-3 py-6">
        <Link
          to="/"
          className="block text-center text-white text-4xl font-bold"
        >
          {isOpen && "HikeUp"}
        </Link>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-5 top-1/2  w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer transform  transition duration-300"
      >
        <span className="text-xs">
          {isOpen ? (
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="mr-1 text-sm 2xl:text-lg"
            />
          ) : (
            <FontAwesomeIcon
              icon={faChevronRight}
              className="mr-2 text-sm 2xl:text-lg"
            />
          )}
        </span>
      </button>
    </div>
  );
};

export default DashboardMenu;
