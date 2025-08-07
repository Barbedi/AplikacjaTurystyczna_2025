import { useEffect, useState } from "react";
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

const TrailPropose = () => {
  const navigate = useNavigate();
  const [trails, setTrails] = useState<Trails[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [pageData, setPageData] = useState<PageData>({
    page: parseInt(searchParams.get("page") || "1"),
    pages: 1,
  });

  const fetchFavoriteTrails = async () => {
    try {
      const favResponse = await favouriteTrailsService.getFavouriteTrails();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const favIds = favResponse.data.data.map(
        (favoriteTrail: any) => favoriteTrail.trail_id,
      );
      setFavoriteIds(favIds);
      return favIds;
    } catch (error) {
      console.error("Error fetching favorite trails:", error);
      return [];
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await trailsService.getTrailsByPublic(pageData.page);
        setTrails(response.data.data);
        setPageData((prev) => ({
          ...prev,
          pages: response.data.totalPages,
        }));
        await fetchFavoriteTrails();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [pageData.page]);

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
      {trails.map((trail, index) => {
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
                  className="bg-white/20 border border-white/30 text-white px-3 py-2  rounded-xl hover:bg-white/30 hover:border-white/40 transition-all duration-200 flex items-center gap-2 font-medium"
                  title="Zobacz szczegóły"
                >
                  <span>Szczegóły</span>
                  <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
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
