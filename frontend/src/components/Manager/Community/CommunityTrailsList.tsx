import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faTrash,faXmark } from "@fortawesome/free-solid-svg-icons";
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
      setShared((prev) => prev.filter((trail) => trail.shared_id !== sharedTrailId));
      setOpenModal(false);
    } catch (error) {
      console.error("Error deleting community trail:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-5 mx-auto">
      {isLoading ? (
        <div className="text-white text-center w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
          <p className="text-lg font-lora font-medium text-white/80">
            Ładowanie społeczności...
          </p>
        </div>
      ) : shared.length === 0 ? (
        <div className="text-white text-center w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
          <p className="text-lg font-lora font-medium text-white/80">
            Brak udostępnionych tras społeczności do wyświetlenia.
          </p>
          <p className="text-sm text-white/60 mt-2">
            Udostępnij swoją pierwszą trasę społeczności lub poczekaj, aż inni to zrobią!
          </p>
        </div>
      ) : (
        shared.map((sharedTrail) => (
          <div
            key={sharedTrail.shared_id}
            className=" flex bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-4 mt-5 transition-all duration-300 ease-in-out border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-xl w-full"
          >
            <span className="flex-1  text-lg font-lora text-white flex items-center gap-3">
              <img
                src={
                  filesService.getImgUrl(
                    sharedTrail.user_profile_image as string,
                  ) || ""
                }
                alt={sharedTrail.user_name}
                className="rounded-full h-12 w-12 object-cover bg-amber-400/50 ring-1 ring-white/30 flex-shrink-0"
              />
              <span className="truncate">{sharedTrail.user_name}</span>
            </span>

            <span className="flex-1 text-lg font-lora text-white">
              {sharedTrail.trail_name}
            </span>
            <span className="flex-1 text-lg font-lora text-white">
              {formatDate(sharedTrail.created_at)}
            </span>
            <span className="flex-1 text-lg font-lora text-white cursor-pointer">
              <FontAwesomeIcon
                icon={faChevronRight}
                onClick={() => handleDetails(sharedTrail.shared_id)}
                className="text-white cursor-pointer text-lg mr-6"
                title="Zobacz szczegóły"
              />
              {currentUser?.id === sharedTrail.user_id && (
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => setOpenModal(true)}
                  className="text-white cursor-pointer text-lg mr-6"
                  title="Cofnij udostępnienie"
                />
              )}
            </span>
          </div>
        ))
      )}

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <h2 className="text-white text-2xl font-semibold mb-4 text-center">
          Czy chcesz cofnać udostępnienie trasy?
        </h2>
        <p className="text-white/70 text-center">
          Ta akcja jest nieodwracalna. Po cofnięciu udostępnienia trasy nie będzie
          można jej odzyskać.
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
