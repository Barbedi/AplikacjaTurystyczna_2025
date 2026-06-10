import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faChevronRight,
  faXmark,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import PlanRoute from "../components/PlanRoute";
import ProposedRoutes from "../components/ProposedRoutes";
import ExploreRoutes from "../components/ExploreRoutes";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../store/auth-context";
import peaksService from "../services/peaks.service";
import { Peaks } from "../assets/Data";
import ToastModalContext from "../store/toast-modal-context";

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [delayedSearchTerm, setDelayedSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Peaks[]>([]);
  const { checkAuth } = useContext(AuthContext);
  const { createToast } = useContext(ToastModalContext);
  const handleClickPlanRoute = async () => {
    const isAuth = await checkAuth();
    if (isAuth) {
      navigate("/dashboard/plan-route");
    } else {
      navigate("/login");
    }
  };

  const clearForm = () => {
    setSearchTerm("");
    setResults([]);
    setShowResults(false);
  };

  // const selectPeak = (peak: Peaks) => {
  //   console.log("Selected peak:", peak);

  //   setSearchTerm(peak.name);
  //   setShowResults(false);
  // };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDelayedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  useEffect(() => {
    if (delayedSearchTerm) {
      peaksService
        .searchPeaks(delayedSearchTerm)
        .then((response) => {
          const searchResults = Array.isArray(response.data?.data)
            ? response.data.data
            : [];
          setResults(searchResults);
          setShowResults(true);
        })
        .catch((error) => {
          console.error("Error searching peaks:", error);
          setResults([]);
          setShowResults(false);
        });
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [delayedSearchTerm]);


  const handleSelectedPeak = async (peak: Peaks) => {
    setSearchTerm(peak.name);
    setShowResults(false);
    const isAuth = await checkAuth();
    if (isAuth) {
      navigate(`/dashboard/my-peaks/${peak.id}`, {
        state: { peak },
      });
    } else {
      navigate(`/peaks/${peak.id}`, {
        state: { peak },
      });
      createToast({
        message: "Zaloguj się, aby zobaczyć szczegóły",
        icon: faTriangleExclamation,
        type: "warning",
        timeout: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen  pb-24 md:pb-0">
      <Navbar />
      <div className="relative bg-[url('/assets/img/IMG_4048.webp')] bg-cover bg-center bg-no-repeat h-[60vh] md:h-[70vh] w-[90%] mx-auto rounded-2xl shadow-xl my-3 duration-300">
        <div className="relative z-20 flex flex-col items-start justify-center h-full px-6 md:px-16 text-white duration-300">
          <h1 className="text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl font-lora mb-6 duration-300">
            Wędrówka marzeń?
            <br />
            Znajdziesz ją z<br /> HikeUp!
          </h1>
          <div className="relative xl:w-1/3 md:w-1/2 duration-300 font-lora">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-xl pointer-events-none duration-300"
            />
            <input
              type="text"
              placeholder="Wyszukaj szlaku lub szczytu..."
              className="bg-white/30 text-white placeholder-white outline-none w-full rounded-4xl px-4 py-3 text-xl md:text-2xl pl-10 duration-300"
              value={searchTerm}
              onChange={(e) => {
                const newValue = e.target.value;
                setSearchTerm(newValue);
              }}
              onFocus={() => results.length > 0 && setShowResults(true)}
            />
            {searchTerm && (
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={clearForm}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
            {showResults && results.length > 0 && (
              <div className="absolute z-[1000] w-full mt-1 bg-black/50 backdrop-blur-lg border border-white/20 rounded-md shadow-lg max-h-60 overflow-y-auto scrollbar-hidden">
                {results.map((peak) => (
                  <div
                    key={peak.id}
                    className="p-2 hover:bg-white/20 cursor-pointer text-white border-b border-white/5"
                    onClick={() => handleSelectedPeak(peak)}
                  >
                    <div className="font-medium">{peak.name}</div>
                    <div className="text-xs text-gray-300">
                      {peak.elevation} m n.p.m. -{" "}
                      {peak.region || "Nieznany region"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/40 rounded-2xl z-10"></div>
      </div>
      <div className="flex items-center justify-center max-w-[2330px] mx-auto px-4">
        <div className="flex flex-col items-center text-center mt-6">
          <div className="text-white text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-lora mb-6 duration-300">
            Zaplanuj trasę
          </div>
          <div className="text-white  text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-lora mb-12 duration-300 text-wrap md:w-2/5 ">
            Twórz świadome i bezpieczne wyprawy dzięki przemyślanemu planowaniu.
          </div>
          <PlanRoute />
          <div className="flex justify-center group items-center my-10 ">
            <a
              onClick={handleClickPlanRoute}
              className="bg-secondary rounded-2xl px-10 py-3 text-2xl font-lora cursor-pointer"
            >
              Planuj trasę
              <FontAwesomeIcon
                icon={faChevronRight}
                className="ml-4 group-hover:translate-x-1 duration-300 transition-all "
              />
            </a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center max-w-[2330px] mx-auto px-4 mb-8">
        <div className="flex flex-col items-center text-center mt-6 w-full">
          <div className="text-white text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-lora mb-6 duration-300">
            Proponowane trasy
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full h-full">
            <ProposedRoutes />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center max-w-[2330px] mx-auto px-4 mb-8">
        <div className="flex flex-col items-center text-center mt-6">
          <div className="text-white text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-lora  duration-300">
            Odkryj trasy w
          </div>
          <div className="flex flex-col items-start font-lora lg:gap-8 gap-5 w-full">
            <ExploreRoutes />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center max-w-[2330px] mx-auto px-4 pb-7">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
