import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FavoriteTrails, Trails } from "../../../assets/Data";
import { useNavigate } from "react-router-dom";
import favouriteTrailsService from "../../../services/favouriteTrails.service";
import trailsService from "../../../services/trails.service";
import Modal from "../../Modal";

const FavouriteTrailPropose = () => {
  const navigate = useNavigate();
  const [trails, setTrails] = useState<Trails[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTrailId, setSelectedTrailId] = useState<number | null>(null);

  useEffect(() => {
    const fetchFavouriteTrails = async () => {
      try {
        const response = await favouriteTrailsService.getFavouriteTrails();
        const favouriteList = response.data.data;

        const fullTrailResponses = await Promise.all(
          favouriteList.map((fav: FavoriteTrails) =>
            trailsService.getTrailById(fav.trail_id),
          ),
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
      setTrails((prevTrails) =>
        prevTrails.filter((trail) => trail.id !== trailId),
      );
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
              onClick={() => {
                setSelectedTrailId(trail.id);
                setOpenModal(true);
              }}
              icon={faTrash}
              className="text-white/70 hover:text-red-400 cursor-pointer text-lg transition-colors duration-200"
              title="Usuń z ulubionych"
            />
          </span>
        </div>
      ))}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <h2 className="text-white text-2xl font-semibold mb-4 text-center">
          Czy chcesz usunąć trasę z ulubionych?
        </h2>
        <p className="text-white/70 text-center">
          Ta akcja jest nieodwracalna. Po usunięciu trasy z ulubionych nie
          będzie można jej odzyskać.
        </p>

        <div className="flex flex-row items-end gap-3 mt-6">
          <button
            onClick={() => setOpenModal(false)}
            className="w-full px-4 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faXmark} />
            <span>Anuluj</span>
          </button>
          <button
            onClick={() => {
              if (selectedTrailId) {
                handleRemoveFavourite(selectedTrailId);
              }
              setOpenModal(false);
            }}
            className="px-4 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/20 transition-all w-full cursor-pointer"
          >
            Usuń
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FavouriteTrailPropose;
