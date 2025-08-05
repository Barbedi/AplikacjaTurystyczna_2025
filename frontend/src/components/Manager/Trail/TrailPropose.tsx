import { useEffect, useState } from "react";
import trailsService from "../../../services/trails.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faHeart } from "@fortawesome/free-solid-svg-icons";
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
      const favIds = favResponse.data.data.map((favoriteTrail: any) => favoriteTrail.trail_id);
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
    <div className="flex flex-col items-center justify-center w-full mt-5 mx-auto">
      {trails.map((trail) => {
        const isFavorite = favoriteIds.includes(trail.id);
        console.log(`Trail ${trail.id} (${trail.name}) is favorite:`, isFavorite);
        
        return (
          <div
            key={trail.id}
            className="flex bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-4 mt-5 transition-all duration-300 ease-in-out border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-xl w-full"
          >
            <span className="flex-1 text-lg font-lora text-white">
              {trail.name}
            </span>
            <span className="flex-1 text-lg font-lora text-white">
              {trail.region}
            </span>
            <span className="flex-1 text-lg font-lora text-white">
              {trail.length_km} km
            </span>
            <span className="flex-1 text-lg font-lora text-white cursor-pointer">
              <FontAwesomeIcon
                onClick={() => handleTrailClick(trail.id)}
                icon={faChevronRight}
                className="text-white hover:text-purple-400 cursor-pointer text-lg mr-2"
                title="Zobacz szczegóły"
              />
              <FontAwesomeIcon
                onClick={() => handleFavoriteClick(trail.id)}
                icon={faHeart}
                className={`cursor-pointer text-lg ml-2 transition-colors duration-200 ${
                  isFavorite
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-400 hover:text-red-400"
                }`}
                title={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
              />
            </span>
          </div>
        );
      })}
      
      <Pagination
        pageData={pageData}
        setPageData={setPageData}
        className="mt-5"
      />
    </div>
  );
};

export default TrailPropose;