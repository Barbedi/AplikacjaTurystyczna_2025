import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FavouriteTrailPropose from "../../components/Manager/Trail/FavouriteTrailPropose";

const FavoriteRoutes = () => {
  return (
    <div className="flex flex-col max-w-6xl items-center justify-center w-full mx-auto mt-6 gap-y-6">
      <div className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faHeart} className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Moje ulubione szlaki
            </h1>
            <p className="text-gray-300 mt-1">
              Lista Twoich ulubionych szlaków
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start w-full">
        <FavouriteTrailPropose />
      </div>
    </div>
  );
};

export default FavoriteRoutes;
