import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/auth-context";
import useGetUsers from "../../../hooks/user/useGetUser";
import trailsService from "../../../services/trails.service";
import { Trails, PageData } from "../../../assets/Data";
import { formatDate } from "../../../utils/format";
import Pagination from "../../Pagination";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faEdit,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../../Modal";

const TrailPeak = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedTrailId, setSelectedTrailId] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [trails, setTrails] = useState<Trails[]>([]);
  const [pageData, setPageData] = useState<PageData>({
    page: parseInt(searchParams.get("page") || "1"),
    pages: 1,
  });
  const { getUserByEmail, usersData } = useGetUsers();
  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);
  const currentUser = usersData?.[0][0];

  useEffect(() => {
    const fetchUserTrails = async () => {
      try {
        if (!currentUser?.id) {
          console.log("No user ID available yet");
          return;
        }
        const response = await trailsService.getTrailsByUser(
          currentUser.id.toString(),
          pageData.page,
        );
        if (response.status === 200) {
          setTrails(response.data.data);
          setPageData((prev) => ({
            ...prev,
            pages: response.data.totalPages,
          }));
        }
      } catch (err) {
        console.error("Error fetching user trails:", err);
      }
    };
    if (currentUser?.id) {
      fetchUserTrails();
    }
  }, [currentUser?.id, pageData.page]);
  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || "1");
    if (pageData.page !== currentPage) {
      setSearchParams({ page: pageData.page.toString() });
    }
  }, [pageData.page, searchParams, setSearchParams]);

  const chooseTrail = (trail: Trails) => {
    navigate(`/dashboard/my-routes/${trail.id}`);
  };

  const editTrail = (trail: Trails) => {
    navigate(`/dashboard/edit-route/${trail.id}`);
  };

  const deleteTrail = async (id: number) => {
    try {
      await trailsService.deleteTrail(id);
      setTrails((prev) => prev.filter((trail) => trail.id !== id));
    } catch (error) {
      console.error("Error deleting trail:", error);
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
            {formatDate(trail.created_at)}
          </span>
          <span className="flex-1 text-lg font-lora text-white">
            <a
              title="Zobacz trase"
              onClick={() => chooseTrail(trail)}
              className="p-4 cursor-pointer"
            >
              {" "}
              <FontAwesomeIcon icon={faChevronRight} className="ml-2" />{" "}
            </a>
            <a
              title="Edycja trasy"
              onClick={() => editTrail(trail)}
              className="p-4 cursor-pointer"
            >
              {" "}
              <FontAwesomeIcon icon={faEdit} />
            </a>
            <a
              title="Usuń trase"
              onClick={() => {
                setSelectedTrailId(trail.id);
                setIsOpenModal(true);
              }}
              className="p-4 cursor-pointer text-white/70 hover:text-red-400 transition-colors duration-200"
            >
              {" "}
              <FontAwesomeIcon icon={faTrash} />
            </a>
          </span>
        </div>
      ))}
      {trails.length === 0 && (
        <div className="text-white text-center mt-5">
          Nie masz jeszcze żadnych tras.
        </div>
      )}
      <Pagination
        pageData={pageData}
        setPageData={setPageData}
        className="mt-5"
      />
      <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <h2 className="text-white text-2xl font-semibold mb-4 text-center">
          Czy chcesz usunąć trasę?
        </h2>
        <p className="text-white/70 text-center">
          Ta akcja jest nieodwracalna. Po usunięciu trasy nie będzie można jej
          odzyskać.
        </p>

        <div className="flex flex-row items-end gap-3 mt-6">
          <button
            onClick={() => setIsOpenModal(false)}
            className="w-full px-4 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faXmark} />
            <span>Anuluj</span>
          </button>
          <button
            onClick={() => {
              if (selectedTrailId) {
                deleteTrail(selectedTrailId);
              }
              setIsOpenModal(false);
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

export default TrailPeak;
