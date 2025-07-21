import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight,faTrash } from "@fortawesome/free-solid-svg-icons";
import { FavoriteTrails, Trails } from "../../assets/Data";
import { useNavigate } from "react-router-dom";
import favouriteTrailsService from "../../services/favouriteTrails.service";
import trailsService from "../../services/trails.service";




const FavouriteTrailPropose = () => {
  const navigate = useNavigate();
  const [trails, setTrails] = useState<Trails[]>([]);

  useEffect(() => {
    const fetchFavouriteTrails = async () => {
      try {
        const response = await favouriteTrailsService.getFavouriteTrails();
        const favouriteList = response.data.data;

        const fullTrailResponses = await Promise.all(
          favouriteList.map((fav: FavoriteTrails) =>
            trailsService.getTrailById(fav.trail_id)
          )
        );

        const fullTrails = fullTrailResponses.map((res) => res.data);
        setTrails(fullTrails);
      } catch (error) {
        console.error("Error fetching trails:", error);
      }
    };

    fetchFavouriteTrails();
  }, []);

    const handleTrailClick = (trailId: number) => {
        navigate(`/dashboard/favorite-routes/${trailId}`);
    };

    const handleRemoveFavourite = async (trailId: number) => {
        try {
            await favouriteTrailsService.removeFavouriteTrail(trailId);
            setTrails((prevTrails) => prevTrails.filter(trail => trail.id !== trailId));
        } catch (error) {
            console.error("Error removing favourite trail:", error);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center w-full mt-5 mx-auto">
      {trails.map((trail) => (
        <div
          key={trail.id}
          className=" flex bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-4 mt-5 transition-all duration-300 ease-in-out border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-xl w-full"
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
              className="text-white cursor-pointer text-lg mr-6"
              title="Zobacz szczegóły"
            />
            <FontAwesomeIcon
                onClick={() => handleRemoveFavourite(trail.id)}
              icon={faTrash}
              className="text-white cursor-pointer text-lg"
              title="Usuń z ulubionych"
            />
            
          </span>
        </div>
      ))}
      
    </div>
    );
};

export default FavouriteTrailPropose;