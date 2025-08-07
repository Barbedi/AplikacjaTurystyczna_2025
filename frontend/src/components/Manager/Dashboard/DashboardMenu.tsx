import AuthContext from "../../../store/auth-context";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faHouse,
  faRoute,
  faLocationPinLock,
  faHeart,
  faMapLocationDot,
  faMountainSun,
  faRankingStar,
  faCircleUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import LogoutIcon from "@mui/icons-material/Logout";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import RateReviewIcon from "@mui/icons-material/RateReview";
import filesService from "../../../services/files.service";
import useGetUsers from "../../../hooks/user/useGetUser";

interface DashboardMenuProps {
  title?: string;
  setTitle?: (title: string) => void;
}

const DashboardMenu: React.FC<DashboardMenuProps> = () => {
  const { checkAuth, user, logout, profileRefreshKey } =
    useContext(AuthContext);
  const { getUserByEmail, usersData } = useGetUsers();
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);

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
  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail, profileRefreshKey]);

  useEffect(() => {
    const currentUser = usersData?.[0][0];
    if (currentUser?.profile_image) {
      setProfileImgUrl(filesService.getImgUrl(currentUser.profile_image));
    }
  }, [usersData]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`relative min-h-screen  bg-transparent/30 flex flex-col justify-between items-start
      transition-[width] duration-300 ease-in-out 
      ${isOpen ? "w-80 md:w-72 2xl:w-80" : "w-20"}`}
    >
      <div className={`p-4 ${!isOpen && "px-2"}`}>
        <div className="flex items-center">
          {profileImgUrl ? (
            <img
              className="rounded-full h-10 w-10 ml-2 object-cover"
              src={profileImgUrl}
              alt="user"
            />
          ) : (
            <div className="bg-white/10 rounded-full h-10 w-10 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCircleUser}
                className="text-white/80 text-4xl"
              />
            </div>
          )}
          {isOpen && (
            <h2 className="text-white md:text-sm 2xl:text-lg font-bold ml-4">
              {user?.email}
            </h2>
          )}
        </div>

        <div className="flex flex-col md:mt-2 mt-6 w-full space-y-2 md:space-y-1">
          <span className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left uppercase ">
            <FontAwesomeIcon
              icon={faHouse}
              className="mr-2 text-lg 2xl:text-xl"
            />
            {isOpen && "Panel"}
          </span>
          <NavLink
            to="plan-route"
            className={({ isActive }) =>
              `text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl transition duration-300 border border-transparent ${
                isActive
                  ? " bg-white/20 backdrop-blur-lg border border-white/20"
                  : " hover:bg-white/10 hover:backdrop-blur-lg "
              }`
            }
          >
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faRoute}
                className="mr-2 text-lg 2xl:text-xl"
              />
              {isOpen && "Zaplanuj trasę"}
            </div>
          </NavLink>
        </div>
        <div className="flex flex-col md:mt-2 mt-6 w-full md:space-y-1 space-y-2">
          <NavLink
            to="my-routes"
            className={({ isActive }) =>
              `text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl transition duration-300 border border-transparent ${
                isActive
                  ? " bg-white/20 backdrop-blur-lg border border-white/20"
                  : " hover:bg-white/10 hover:backdrop-blur-lg "
              }`
            }
          >
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faLocationPinLock}
                className="mr-2 text-lg 2xl:text-xl"
              />
              {isOpen && "Moje trasy"}
            </div>
          </NavLink>
          <NavLink
            to="favorite-routes"
            className={({ isActive }) =>
              `text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl transition duration-300 border border-transparent ${
                isActive
                  ? " bg-white/20 backdrop-blur-lg border border-white/20"
                  : " hover:bg-white/10 hover:backdrop-blur-lg "
              }`
            }
          >
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faHeart}
                className="mr-2 text-lg 2xl:text-xl"
              />
              {isOpen && "Ulubione trasy"}
            </div>
          </NavLink>
          <NavLink
            to="recommended"
            className={({ isActive }) =>
              `text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl transition duration-300 border border-transparent ${
                isActive
                  ? " bg-white/20 backdrop-blur-lg border border-white/20"
                  : " hover:bg-white/10 hover:backdrop-blur-lg "
              }`
            }
          >
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faMapLocationDot}
                className="mr-2 text-lg 2xl:text-xl"
              />
              {isOpen && "Proponowane trasy"}
            </div>
          </NavLink>
        </div>
        <div className="flex flex-col md:mt-2 mt-6 w-full md:space-y-1 space-y-2">
          <NavLink
            to="my-peaks"
            className={({ isActive }) =>
              `text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl transition duration-300 border border-transparent ${
                isActive
                  ? " bg-white/20 backdrop-blur-lg border border-white/20"
                  : " hover:bg-white/10 hover:backdrop-blur-lg "
              }`
            }
          >
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <PermMediaIcon className="mr-2 text-sm 2xl:text-lg" />
              {isOpen && "Moje szczyty"}
            </div>
          </NavLink>
          <NavLink
            to="crown-peaks"
            className={({ isActive }) =>
              `text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl transition duration-300 border border-transparent ${
                isActive
                  ? " bg-white/20 backdrop-blur-lg border border-white/20"
                  : " hover:bg-white/10 hover:backdrop-blur-lg "
              }`
            }
          >
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faMountainSun}
                className="mr-2 text-lg 2xl:text-xl"
              />
              {isOpen && "Korony Gór"}
            </div>
          </NavLink>
          <NavLink
            to="statistics"
            className={({ isActive }) =>
              `text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl transition duration-300 border border-transparent ${
                isActive
                  ? " bg-white/20 backdrop-blur-lg border border-white/20"
                  : " hover:bg-white/10 hover:backdrop-blur-lg "
              }`
            }
          >
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faRankingStar}
                className="mr-2 text-lg 2xl:text-xl"
              />
              {isOpen && "Statystyki"}
            </div>
          </NavLink>
        </div>
        <div className="flex flex-col md:mt-2 mt-6 w-full md:space-y-1 space-y-2">
          <NavLink
            to="community-trails"
            className={({ isActive }) =>
              `text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl transition duration-300 border border-transparent ${
                isActive
                  ? " bg-white/20 backdrop-blur-lg border border-white/20"
                  : " hover:bg-white/10 hover:backdrop-blur-lg "
              }`
            }
          >
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faUsers}
                className="mr-2 text-lg 2xl:text-xl"
              />
              {isOpen && "Społeczność"}
            </div>
          </NavLink>
          <NavLink
            to="my-reviews"
            className={({ isActive }) =>
              `text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl transition duration-300 border border-transparent ${
                isActive
                  ? " bg-white/20 backdrop-blur-lg border border-white/20"
                  : " hover:bg-white/10 hover:backdrop-blur-lg "
              }`
            }
          >
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <RateReviewIcon className="mr-2 text-sm 2xl:text-lg" />
              {isOpen && "Moje opinie"}
            </div>
          </NavLink>
        </div>
        <div className="flex flex-col md:mt-2 mt-6 w-full md:space-y-1 space-y-2">
          <NavLink
            to="my-profile"
            className={({ isActive }) =>
              `text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl transition duration-300 border border-transparent ${
                isActive
                  ? " bg-white/20 backdrop-blur-lg border border-white/20"
                  : " hover:bg-white/10 hover:backdrop-blur-lg "
              }`
            }
          >
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <FontAwesomeIcon
                icon={faCircleUser}
                className="mr-2 text-lg 2xl:text-xl"
              />
              {isOpen && "Mój profil"}
            </div>
          </NavLink>
          <button
            onClick={async () => {
              await handleLogout();
              navigate("/");
            }}
            className="text-white md:text-sm 2xl:text-lg font-lora py-2 px-4 text-left rounded-2xl hover:bg-white/10 hover:backdrop-blur-lg transition duration-300"
          >
            <div
              className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
            >
              <LogoutIcon className="mr-2 text-lg 2xl:text-xl" />
              {isOpen && "Wyloguj"}
            </div>
          </button>
        </div>
      </div>
      <div
        className="fixed bottom-0 w-full md:py-3 py-6"
        style={{
          width: isOpen
            ? window.innerWidth >= 1536
              ? "20rem"
              : window.innerWidth >= 768
                ? "18rem"
                : "20rem"
            : "5rem",
          zIndex: 10,
        }}
      >
        <div className="bg-transparent/80 backdrop-blur-sm">
          <Link
            to="/"
            className="block text-center text-white text-4xl font-bold"
          >
            {isOpen && "HikeUp"}
          </Link>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-5 top-1/2 z-50 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer transform -translate-y-1/2 transition duration-300"
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
