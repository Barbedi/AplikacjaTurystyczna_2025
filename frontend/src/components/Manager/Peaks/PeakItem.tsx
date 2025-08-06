import { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Peaks, PageData } from "../../../assets/Data";
import Pagination from "../../Pagination";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import userpeaksService from "../../../services/userpeaks.service";
import AuthContext from "../../../store/auth-context";
import useGetUsers from "../../../hooks/user/useGetUser";

interface PeakItemProps {
  fetchPeaks: (page?: number) => Promise<{
    data: { data: Peaks[]; totalPages: number; page: number; limit: number };
  }>;
}

interface PeakWithVerification extends Peaks {
  verified?: boolean;
}

const PeakItem = ({ fetchPeaks }: PeakItemProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [peaks, setPeaks] = useState<PeakWithVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData } = useGetUsers();
  const [pageData, setPageData] = useState<PageData>({
    page: parseInt(searchParams.get("page") || "1"),
    pages: 1,
  });

  const currentUser = usersData?.[0][0];

  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);

  useEffect(() => {
    if (!currentUser?.id) return;
    
    setLoading(true);
    fetchPeaks(pageData.page)
      .then(async (res) => {
        const peaksData = res.data.data;
        
        // Dla każdego szczytu sprawdź czy jest zweryfikowany przez użytkownika
        const peaksWithVerification = await Promise.all(
          peaksData.map(async (peak) => {
            try {
              const userPeakResponse = await userpeaksService.getUserPeakById(
                currentUser.id!,
                peak.id
              );
              return {
                ...peak,
                verified: userPeakResponse.data.data.verified || false
              };
            } catch {
              return {
                ...peak,
                verified: false
              };
            }
          })
        );
        
        setPeaks(peaksWithVerification);
        setPageData((prev) => ({
          ...prev,
          pages: res.data.totalPages,
        }));
      })
      .catch((err) => {
        console.error("Błąd pobierania szczytów:", err);
      })
      .finally(() => setLoading(false));
  }, [fetchPeaks, pageData.page, currentUser?.id]);

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || "1");
    if (pageData.page !== currentPage) {
      setSearchParams({ page: pageData.page.toString() });
    }
  }, [pageData.page, searchParams, setSearchParams]);

  if (loading) {
    return (
      <div className="text-white text-center mt-5">Ładowanie szczytów...</div>
    );
  }

  const editPeak = async (peaks: Peaks) => {
    const currentPath = location.pathname;

    if (currentPath.includes("crown-poland")) {
      navigate(`/dashboard/crown-peaks/crown-poland/${peaks.id}`);
    } else if (currentPath.includes("crown-beskid")) {
      navigate(`/dashboard/crown-peaks/crown-beskid/${peaks.id}`);
    } else {
      navigate(`/dashboard/crown-peaks/edit-peak/${peaks.id}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-5 mx-auto">
      {peaks.map((peak) => (
        <div
          key={peak.id}
          className=" flex bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-4 mt-5 transition-all duration-300 ease-in-out border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-xl w-full"
        >
          <span className="flex-1 text-lg font-lora text-white">
            {peak.name}
          </span>
          <span className="flex-1 text-lg font-lora text-white">
            {peak.elevation} m n.p.m.
          </span>
          <span className="flex-1 text-lg font-lora text-white">
            {peak.region}
          </span>
          <span className="flex-1 text-lg font-lora text-white">
            {peak.verified ? (
              <VerifiedIcon
                className="text-green-500"
                titleAccess="Zweryfikowane"
              />
            ) : (
              "Nie"
            )}
          </span>
          <span className="flex-1 text-lg font-lora text-white">
            <FontAwesomeIcon
              icon={faChevronRight}
              onClick={() => editPeak(peak)}
              className="text-white cursor-pointer text-lg"
              title="Zobacz szczegóły"
            />
          </span>
        </div>
      ))}
      <Pagination
        pageData={pageData}
        setPageData={setPageData}
        className="mt-5"
      />
    </div>
  );
};

export default PeakItem;
