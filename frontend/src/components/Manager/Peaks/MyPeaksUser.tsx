import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import userpeaksService from "../../../services/userpeaks.service";
import { useState, useEffect, useContext } from "react";
import useGetUsers from "../../../hooks/user/useGetUser";
import AuthContext from "../../../store/auth-context";
import { PageData, UserPeak } from "../../../assets/Data";
import { formatDate } from "../../../utils/format";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../Pagination";

const MyPeaksUser = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const [myPeaks, setMyPeaks] = useState<UserPeak[]>([]);
  const [loading, setLoading] = useState(true);
  const { getUserByEmail, usersData } = useGetUsers();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<PageData>({
    page: parseInt(searchParams.get("page") || "1"),
    pages: 1,
  });

  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);

  const currentUser = usersData?.[0][0];

  useEffect(() => {
    const fetchMyPeaks = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        const response = await userpeaksService.getUserPeaks(
          currentUser.id,
          pageData.page,
        );
        const { data, total, limit } = response.data;

        setMyPeaks(data || []);
        setPageData((prev) => ({
          ...prev,
          pages: Math.ceil(total / limit),
        }));
      } catch (error) {
        console.error("Error fetching my peaks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPeaks();
  }, [currentUser?.id, pageData.page]);

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || "1");
    if (pageData.page !== currentPage) {
      setSearchParams({ page: pageData.page.toString() });
    }
  }, [pageData.page, searchParams, setSearchParams]);
  return (
    <div className="flex flex-col  mt-4">
      {loading ? (
        <div className="flex items-center justify-center w-full p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-md">
          <p className="text-white">Ładowanie...</p>
        </div>
      ) : myPeaks.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-md">
          <h2 className="text-lg font-lora text-white">
            Nie masz jeszcze żadnych szczytów!
          </h2>
          <p className="text-sm text-gray-300">
            Zdobądź swoje pierwsze szczyty!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
            {myPeaks.map((peak) => (
              <div
                key={peak.peak_id}
                className="flex flex-col items-center justify-center w-full p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-md mb-3"
              >
                <h2 className="text-lg font-lora text-white">
                  <span className="relative inline-block">
                    <FontAwesomeIcon
                      title="Ilość zdobyć"
                      className="text-yellow-500 text-2xl"
                      icon={faCrown}
                    />
                    <span className="absolute top-2 left-1.5 text-white font-bold text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {peak.times_visited}
                    </span>
                  </span>{" "}
                  Szczyt zdobyty!
                </h2>
                <h3 className="text-md font-lora text-white">
                  {peak.peak_name}
                </h3>
                <p className="text-sm text-gray-300">
                  Data: {formatDate(peak.last_visited)}
                </p>
                <a
                  onClick={() =>
                    navigate(`/dashboard/my-peaks/${peak.peak_id}`)
                  }
                  className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/40 transition-all duration-200 cursor-pointer"
                >
                  Zobacz więcej
                </a>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Pagination pageData={pageData} setPageData={setPageData} />
          </div>
        </>
      )}
    </div>
  );
};

export default MyPeaksUser;
