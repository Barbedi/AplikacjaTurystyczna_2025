import { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faMountain } from "@fortawesome/free-solid-svg-icons";
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
        const peaksWithVerification = await Promise.all(
          peaksData.map(async (peak) => {
            try {
              const userPeakResponse = await userpeaksService.getUserPeakById(
                currentUser.id!,
                peak.id,
              );
              return {
                ...peak,
                verified: userPeakResponse.data.data.verified || false,
              };
            } catch {
              return {
                ...peak,
                verified: false,
              };
            }
          }),
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
    <div className="flex flex-col w-full mt-2 mx-auto space-y-3">
      {peaks.map((peak, index) => {
        return (
          <div
            key={peak.id}
            className={`group relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 transition-all duration-300 ease-in-out border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-2xl hover:scale-[1.02] w-full ${
              index === 0 ? "animate-fadeInUp" : ""
            }`}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex items-center gap-6">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faMountain}
                    className="text-xl text-white"
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <h3 className="text-xl font-lora text-white truncate font-semibold">
                    {peak.name}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">Szczyt górski</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-300 mb-2">Wysokość</span>
                  <div className="flex items-center gap-1 bg-white/10 px-3 py-2 rounded-xl">
                    <span className="text-lg font-bold text-white whitespace-nowrap">
                      {peak.elevation} m
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-300 mb-2">
                    Zweryfikowany
                  </span>
                  <div className="flex items-center justify-center gap-1 bg-white/10 px-3 py-2 rounded-xl min-w-[80px] h-[40px]">
                    {peak.verified ? (
                      <VerifiedIcon
                        className="text-green-500"
                        titleAccess="Zweryfikowane"
                      />
                    ) : (
                      <span className="text-lg font-bold text-white">Nie</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 mt-6">
                <button
                  onClick={() => editPeak(peak)}
                  className="bg-white/20 border border-white/30 text-white px-3 py-2 rounded-xl hover:bg-white/30 hover:border-white/40 transition-all duration-200 flex items-center gap-2 font-medium"
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
      {peaks.length > 0 && (
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

export default PeakItem;
