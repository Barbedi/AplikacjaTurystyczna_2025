import {
  faMountainSun,
  faMountain,
  faCrown,
  faRoute,
  faShare,
  faPersonWalking,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import statisticsService from "../../services/statistics.service";
import { useEffect, useState } from "react";
import type { Statistics } from "../../assets/Data";
import InfoCard from "../../components/Manager/Statistic/InfoCard";
import AuthContext from "../../store/auth-context";
import useGetUsers from "../../hooks/user/useGetUser";
import { useContext } from "react";

const Statistics = () => {
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData } = useGetUsers();

  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);

  const currentUser = usersData?.[0][0];
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await statisticsService.getStatisticsForUser(
          currentUser?.id || 0,
        );
        setStatistics(data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchStatistics();
  }, [currentUser?.id]);

  return (
    <div className="w-full max-w-6xl px-4 md:px-6 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-lg rounded-lg p-5 shadow-md border-2 border-white/30">
          <h2 className="text-3xl text-white font-lora mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faMountainSun} /> Korona Gór Polski
          </h2>
          <div className="grid grid-cols-3 gap-4 rounded-2xl w-full">
            <div className="group flex flex-col items-center backdrop-blur-2xl p-4 rounded-lg bg-white/20 border border-transparent hover:bg-white/30 hover:border-white/15 transition duration-300 ease-in-out">
              <h3 className="text-2xl text-white font-bold group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300">
                {statistics?.crowns.kgp.visited || 0}
              </h3>
              <p className="text-white text-sm text-center whitespace-nowrap">
                Zdobyte szczyty
              </p>
            </div>

            <div className="group flex flex-col items-center backdrop-blur-2xl p-4 rounded-lg bg-white/20 border border-transparent hover:bg-white/30 hover:border-white/15 transition duration-300 ease-in-out">
              <h3 className="text-2xl text-white font-bold group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300">
                {statistics?.crowns.kgp.all || 0}
              </h3>
              <p className="text-white text-sm text-center whitespace-nowrap">
                Wszystkie szczyty
              </p>
            </div>

            <div className="group flex flex-col items-center backdrop-blur-2xl p-4 rounded-lg bg-white/20 border border-transparent hover:bg-white/30 hover:border-white/15 transition duration-300 ease-in-out">
              <h3 className="text-2xl text-white font-bold group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300">
                {(statistics?.crowns.kgp.percent ?? 0).toFixed(1)}%
              </h3>
              <p className="text-white text-sm text-center whitespace-nowrap">
                Ukończono
              </p>
            </div>
          </div>

          <div className="w-full mt-4">
            <div className="flex justify-between text-sm text-purple-400/80 mb-2">
              <span>Postęp</span>
              <span>
                {statistics?.crowns.kgp.visited || 0}/
                {statistics?.crowns.kgp.all || 0}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 transition-all duration-1000 ease-out rounded-full relative overflow-hidden"
                style={{ width: `${statistics?.crowns.kgp.percent || 0}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-bar"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-lg rounded-lg p-5 shadow-md border-2 border-white/30">
          <h2 className="text-3xl text-white font-lora mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faMountainSun} /> Korona Beskidu Sądeckiego
          </h2>
          <div className="grid grid-cols-3 gap-4 rounded-2xl w-full">
            <div className="group flex flex-col items-center backdrop-blur-2xl p-4 rounded-lg bg-white/20 border border-transparent hover:bg-white/30 hover:border-white/15 transition duration-300 ease-in-out">
              <h3 className="text-2xl text-white font-bold group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300">
                {statistics?.crowns.kbs.visited || 0}
              </h3>
              <p className="text-white text-sm text-center whitespace-nowrap">
                Zdobyte szczyty
              </p>
            </div>

            <div className="group flex flex-col items-center backdrop-blur-2xl p-4 rounded-lg bg-white/20 border border-transparent hover:bg-white/30 hover:border-white/15 transition duration-300 ease-in-out">
              <h3 className="text-2xl text-white font-bold group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300">
                {statistics?.crowns.kbs.all || 0}
              </h3>
              <p className="text-white text-sm text-center whitespace-nowrap">
                Wszystkie szczyty
              </p>
            </div>

            <div className="group flex flex-col items-center backdrop-blur-2xl p-4 rounded-lg bg-white/20 border border-transparent hover:bg-white/30 hover:border-white/15 transition duration-300 ease-in-out">
              <h3 className="text-2xl text-white font-bold group-hover:animate-pulse group-hover:scale-110 transition-transform duration-300">
                {(statistics?.crowns.kbs.percent ?? 0).toFixed(1)}%
              </h3>
              <p className="text-white text-sm text-center whitespace-nowrap">
                Ukończono
              </p>
            </div>
          </div>

          <div className="w-full mt-4">
            <div className="flex justify-between text-sm text-purple-400/80 mb-2">
              <span>Postęp</span>
              <span>
                {statistics?.crowns.kbs.visited || 0}/
                {statistics?.crowns.kbs.all || 0}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 transition-all duration-1000 ease-out rounded-full relative overflow-hidden "
                style={{ width: `${statistics?.crowns.kbs.percent || 0}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent  animate-bar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <InfoCard
          icon={faCrown}
          title="Zdobyte szczyty"
          value={statistics?.allUserPeaks || 0}
          description="Łączna liczba zdobytych szczytów"
        />
        <InfoCard
          icon={faRoute}
          title="Utworzone trasy"
          value={statistics?.allUserTrails || 0}
          description="Łączna liczba utworzonych tras"
        />
        <InfoCard
          icon={faShare}
          title="Udostępnione trasy"
          value={statistics?.allUserTrailsShared || 0}
          description="Łączna liczba udostępnionych tras"
        />
        <InfoCard
          icon={faPersonWalking}
          title="Najdłuższa trasa"
          value={statistics?.longestTrail?.length_km || 0}
          name={statistics?.longestTrail?.name || "Brak danych"}
          description="Najdłuższa twoja trasa"
          unit="km"
        />
        <InfoCard
          icon={faMountain}
          title="Najwyższy twój szczyt"
          value={statistics?.highestPeak?.elevation || 0}
          name={statistics?.highestPeak?.name || "Brak danych"}
          description="Najwyżej zdobyty szczyt"
          unit="m n.p.m."
        />
        <InfoCard
          icon={faClock}
          title="Ostatnio szczyt"
          value={statistics?.lastPeak?.name || "Brak danych"}
          description="Ostatnio zdobyty szczyt"
        />
      </div>
    </div>
  );
};

export default Statistics;
