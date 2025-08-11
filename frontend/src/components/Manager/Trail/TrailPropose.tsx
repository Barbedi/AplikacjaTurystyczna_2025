import { useContext, useEffect, useState, useCallback } from "react";
import trailsService from "../../../services/trails.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faHeart,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";
import { PageData, Trails } from "../../../assets/Data";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../Pagination";
import favouriteTrailsService from "../../../services/favouriteTrails.service";
import useGetUsers from "../../../hooks/user/useGetUser";
import AuthContext from "../../../store/auth-context";
import { experienceMap, fitnessMap,getAllowedTrailLevels,mapDifficultyToNumber } from "../../../utils/proposeTrail";

const TrailPropose = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData } = useGetUsers();
  const [trails, setTrails] = useState<Trails[]>([]);
  const [allTrails, setAllTrails] = useState<Trails[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [pageData, setPageData] = useState<PageData>({
    page: parseInt(searchParams.get("page") || "1"),
    pages: 1,
  });

  const TRAILS_PER_PAGE = 5;

  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);

  const currentUser = usersData?.[0][0];

  const fetchFavoriteTrails = useCallback(async () => {
    try {
      const favResponse = await favouriteTrailsService.getFavouriteTrails();
      const favIds = favResponse.data.data.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (favoriteTrail: any) => favoriteTrail.trail_id,
      );
      setFavoriteIds(favIds);
      return favIds;
    } catch (error) {
      console.error("Error fetching favorite trails:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchAllTrails = async () => {
      try {
        let allTrailsData: Trails[] = [];
        let currentPage = 1;
        let totalPages = 1;
        do {
          const response = await trailsService.getTrailsByPublic(currentPage);
          allTrailsData = [...allTrailsData, ...response.data.data];
          totalPages = response.data.totalPages;
          currentPage++;
        } while (currentPage <= totalPages);

        setAllTrails(allTrailsData);
        await fetchFavoriteTrails();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllTrails();
  }, [fetchFavoriteTrails]);

  useEffect(() => {
    let filteredTrails = allTrails;
    if (currentUser && allTrails.length > 0) {
      if (!currentUser.level_of_experience || !currentUser.fitness_level) {
        setTrails([]);
        setPageData({
          page: 1,
          pages: 1
        });
        return;
      }
      
      const exp = experienceMap[currentUser.level_of_experience ?? "beginner"];
      const fit = fitnessMap[currentUser.fitness_level ?? "beginner"];
      const [minDiff, maxDiff] = getAllowedTrailLevels(exp, fit);

      filteredTrails = allTrails.filter((trail: Trails) => {
        const numericDiff = mapDifficultyToNumber(trail.difficulty.toLowerCase());
        return numericDiff >= minDiff && numericDiff <= maxDiff;
      });
    }
    const totalFilteredTrails = filteredTrails.length;
    const totalPages = Math.ceil(totalFilteredTrails / TRAILS_PER_PAGE);
    
    const currentPageNumber = pageData.page > totalPages ? 1 : pageData.page;
    
    setPageData({
      page: currentPageNumber,
      pages: totalPages || 1
    });

    const startIndex = (currentPageNumber - 1) * TRAILS_PER_PAGE;
    const endIndex = startIndex + TRAILS_PER_PAGE;
    const trailsForCurrentPage = filteredTrails.slice(startIndex, endIndex);
    
    setTrails(trailsForCurrentPage);
  }, [allTrails, currentUser, pageData.page, TRAILS_PER_PAGE]);

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || "1");
    if (pageData.page !== currentPage) {
      setSearchParams({ page: pageData.page.toString() });
    }
  }, [pageData.page, searchParams, setSearchParams]);

  const handleTrailClick = (trailId: number) => {
    navigate(`/dashboard/recommended/${trailId}`);
  };

  const handleFavoriteClick = async (trailId: number) => {
    try {
      const isFavorite = favoriteIds.includes(trailId);
      if (isFavorite) {
        await favouriteTrailsService.removeFavouriteTrail(trailId);
        setFavoriteIds((prev) => {
          const newIds = prev.filter((id) => id !== trailId);
          return newIds;
        });
      } else {
        await favouriteTrailsService.addFavouriteTrail(trailId);
        setFavoriteIds((prev) => {
          const newIds = [...prev, trailId];
          return newIds;
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      await fetchFavoriteTrails();
    }
  };

  return (
    <div className="flex flex-col w-full mt-5 mx-auto space-y-3">
      {trails.length === 0 && currentUser && (!currentUser.level_of_experience || !currentUser.fitness_level) ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/20 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon
              icon={faRoute}
              className="text-2xl text-white"
            />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Brak tras do odpowiedniego poziomu
          </h3>
          <p className="text-gray-300 mb-4">
            Aby zobaczyć trasy dostosowane do Twojego poziomu, uzupełnij swój profil.
          </p>
          <button
            onClick={() => navigate('/dashboard/my-profile')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl transition-all duration-200 font-medium"
          >
            Uzupełnij profil
          </button>
        </div>
      ) : (
        trails.map((trail, index) => {
          const isFavorite = favoriteIds.includes(trail.id);
          return (
            <div
              key={trail.id}
              className={`group relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 transition-all duration-300 ease-in-out border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-2xl hover:scale-[1.02] w-full ${
                index === 0 ? "animate-fadeInUp" : ""
              }`}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative flex items-center gap-6">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faRoute}
                    className="text-xl text-white"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-lora text-white truncate font-semibold">
                    {trail.name}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Szlak turystyczny  
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-300 mb-2">Trudność</span>
                  <div className="flex-shrink-0 w-[110px]">
                    <div className="inline-flex items-center justify-center px-4 py-2 w-full rounded-xl border border-purple-500/30 bg-purple-500/20 backdrop-blur-sm">
                      <span className="text-sm font-bold text-purple-200 text-center truncate">
                        {trail.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-300 mb-2">Długość</span>
                  <div className="flex items-center gap-1 bg-white/10 px-3 py-2 rounded-xl">
                    <span className="text-lg font-bold text-white whitespace-nowrap">
                      {trail.length_km} km
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 mt-5">
                <button
                  onClick={() => handleFavoriteClick(trail.id)}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isFavorite
                      ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                      : "bg-white/10 border border-white/20 text-gray-400 hover:bg-white/20 hover:text-red-400"
                  }`}
                  title={
                    isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"
                  }
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="text-lg cursor-pointer"
                  />
                </button>

                <button
                  onClick={() => handleTrailClick(trail.id)}
                  className="cursor-pointer bg-white/20 border border-white/30 text-white px-3 py-2  rounded-xl hover:bg-white/30 hover:border-white/40 transition-all duration-200 flex items-center gap-2 font-medium"
                  title="Zobacz szczegóły"
                >
                  <span>Szczegóły</span>
                  <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        );
        })
      )}
      {trails.length > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            pageData={pageData}
            setPageData={setPageData}
            className=""
          />
        </div>
      )}
    </div>
  );
};

export default TrailPropose;
