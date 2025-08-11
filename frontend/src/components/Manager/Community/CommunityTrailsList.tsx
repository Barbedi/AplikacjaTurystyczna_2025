import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useContext } from "react";
import communitytrailsService from "../../../services/communitytrails.service";
import { ExtendedCommunityTrails } from "../../../assets/Data";
import { formatDate } from "../../../utils/format";
import { useNavigate } from "react-router-dom";
import filesService from "../../../services/files.service";
import Modal from "../../Modal";
import AuthContext from "../../../store/auth-context";
import useGetUsers from "../../../hooks/user/useGetUser";

const CommunityTrailsList = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData } = useGetUsers();
  const [shared, setShared] = useState<ExtendedCommunityTrails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);

  const currentUser = usersData?.[0][0];

  useEffect(() => {
    const fetchCommunityTrails = async () => {
      try {
        setIsLoading(true);
        const response = await communitytrailsService.getCommunityTrails();
        setShared(response.data);
        console.log("Odebrane dane:", response.data);
      } catch (error) {
        console.error("Error fetching community trails:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunityTrails();
  }, []);

  const handleDetails = (sharedTrailId: number) => {
    navigate(`/dashboard/community-trails/${sharedTrailId}`);
  };
  const handleDelete = async (sharedTrailId: number) => {
    try {
      await communitytrailsService.deleteCommunityTrail(sharedTrailId);
      setShared((prev) =>
        prev.filter((trail) => trail.shared_id !== sharedTrailId),
      );
      setOpenModal(false);
    } catch (error) {
      console.error("Error deleting community trail:", error);
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
      ) : shared.length === 0 ? (
        <div className="text-white text-center w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
          <p className="text-lg font-lora font-medium text-white/80">
            Brak tras do wyświetlenia.
          </p>
          <p className="text-sm text-white/60 mt-2">
            Zaplanuj swoją pierwszą trasę, aby rozpocząć przygodę!
          </p>
        </div>
      ) : (
        shared.map((sharedTrail, index) => {
          return (
            <div
              key={sharedTrail.shared_id}
              className={`group relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 transition-all duration-300 ease-in-out border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-2xl hover:scale-[1.02] w-full ${
                index === 0 ? "animate-fadeInUp" : ""
              }`}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative flex items-center gap-6">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={
                      filesService.getImgUrl(
                        sharedTrail.user_profile_image as string,
                      ) || ""
                    }
                    alt={sharedTrail.user_name}
                    className="rounded-full h-15 w-15 object-cover bg-amber-400/50 ring-1 ring-white/30 flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0 flex-1 ">
                    <h3 className="text-xl font-lora text-white truncate font-semibold">
                      {sharedTrail.user_name}
                    </h3>
                    <p className="text-sm text-gray-300 mt-0.5">Użytkownik</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-300 mb-2">
                      Nazwa trasy
                    </span>
                    <div className="flex items-center gap-1 bg-white/10 px-3 py-2 rounded-xl">
                      <span className="text-lg font-bold text-white whitespace-nowrap">
                        {sharedTrail.trail_name}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-300 mb-2">
                      Data udostępnienia
                    </span>
                    <div className="flex items-center gap-1 bg-white/10 px-3 py-2 rounded-xl">
                      <span className="text-lg font-bold text-white whitespace-nowrap">
                        {formatDate(sharedTrail.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 mt-6">
                  <button
                    onClick={() => handleDetails(sharedTrail.shared_id)}
                    className="bg-white/20 cursor-pointer border border-white/30 text-white px-3 py-2 rounded-xl hover:bg-white/30 hover:border-white/40 transition-all duration-200 flex items-center gap-2 font-medium"
                    title="Zobacz szczegóły"
                  >
                    <span>Szczegóły</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-sm"
                    />
                  </button>
                  {currentUser?.id === sharedTrail.user_id && (
                    <button
                      onClick={() => setOpenModal(true)}
                      className="cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 bg-white/20 border border-white/30 text-white hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-500"
                      title="Cofnij udostępnienie"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-lg cursor-pointer"
                      />
                    </button>
                  )}
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
          Ta akcja jest nieodwracalna. Po cofnięciu udostępnienia trasy nie
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
            onClick={() => handleDelete(shared[0].shared_id)}
            className="px-4 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/20 transition-all w-full cursor-pointer"
          >
            Usuń
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CommunityTrailsList;
