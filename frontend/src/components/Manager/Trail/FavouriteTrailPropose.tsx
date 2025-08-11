import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faTrash,
  faXmark,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";
import { FavoriteTrails, Trails } from "../../../assets/Data";
import { useNavigate } from "react-router-dom";
import favouriteTrailsService from "../../../services/favouriteTrails.service";
import trailsService from "../../../services/trails.service";
import Modal from "../../Modal";

const FavouriteTrailPropose = () => {
  const navigate = useNavigate();
  const [trails, setTrails] = useState<Trails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTrailId, setSelectedTrailId] = useState<number | null>(null);

  useEffect(() => {
    const fetchFavouriteTrails = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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
    <div className="flex flex-col w-full mt-5 mx-auto space-y-3">
      {isLoading ? (
        <div className="text-white text-center w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
          <p className="text-lg font-lora font-medium text-white/80">
            Ładowanie tras...
          </p>
        </div>
      ) : trails.length === 0 ? (
        <div className="text-white text-center w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
          <p className="text-lg font-lora font-medium text-white/80">
            Brak tras do wyświetlenia.
          </p>
          <p className="text-sm text-white/60 mt-2">
            Zaplanuj swoją pierwszą trasę, aby rozpocząć przygodę!
          </p>
        </div>
      ) : (
        trails.map((trail, index) => {
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
                      Szlak turystyczny{" "}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-300 mb-2">Region</span>
                    <div className="flex items-center gap-1 bg-white/10 px-3 py-2 rounded-xl">
                      <span className="text-lg font-bold text-white whitespace-nowrap">
                        {trail.region}
                      </span>
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
                <div className="flex items-center gap-3 flex-shrink-0 mt-6">
                  <button
                    onClick={() => handleTrailClick(trail.id)}
                    className="bg-white/20 cursor-pointer border border-white/30 text-white px-3 py-2 rounded-xl hover:bg-white/30 hover:border-white/40 transition-all duration-200 flex items-center gap-2 font-medium"
                    title="Zobacz szczegóły"
                  >
                    <span>Szczegóły</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-sm"
                    />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTrailId(trail.id);
                      setOpenModal(true);
                    }}
                    className="cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 bg-white/20 border border-white/30 text-white hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-500"
                    title="Usuń trasę"
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-lg cursor-pointer"
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <h2 className="text-white text-2xl font-semibold mb-4 text-center">
          Czy chcesz usunąć trasę?
        </h2>
        <p className="text-white/70 text-center">
          Ta akcja jest nieodwracalna. Po usunięciu trasy nie będzie można jej
          odzyskać.
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
