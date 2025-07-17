import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import userpeaksService from "../../services/userpeaks.service";
import { useState, useEffect, useContext } from "react";
import useGetUsers from "../../hooks/user/useGetUser";
import AuthContext from "../../store/auth-context";
import { UserPeak } from "../../assets/Data";
import { formatDate } from "../../utils/format";

const MyPeaksUser = () => {
  const { user } = useContext(AuthContext);
  const [myPeaks, setMyPeaks] = useState<UserPeak[]>([]);
  const [loading, setLoading] = useState(true);
  const { getUserByEmail, usersData } = useGetUsers();

  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);

  const currentUser = usersData?.[0]?.[0];

  useEffect(() => {
    const fetchMyPeaks = async () => {
      if (!currentUser?.id) {
        return;
      }

      try {
        setLoading(true);
        const response = await userpeaksService.getUserPeaks(currentUser.id);
        setMyPeaks(response.data.data || []);
      } catch (error) {
        console.error("Error fetching my peaks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchMyPeaks();
    }
  }, [currentUser?.id]);

  return loading ? (
    <div className="flex items-center justify-center w-full p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-md">
      <p className="text-white">Ładowanie...</p>
    </div>
  ) : myPeaks.length === 0 ? (
    <div className="flex flex-col items-center justify-center w-full p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-md">
      <h2 className="text-lg font-lora text-white">
        Nie masz jeszcze żadnych szczytów!
      </h2>
      <p className="text-sm text-gray-300">Zdobądź swoje pierwsze szczyty!</p>
    </div>
  ) : (
    myPeaks.map((peak) => (
      <div
        key={peak.peak_id}
        className="flex flex-col items-center justify-center w-full p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-md mb-3 "
      >
        <h2 className="text-lg font-lora text-white">
          <FontAwesomeIcon icon={faCrown} className="text-yellow-500" /> Szczyt
          zdobyty!
        </h2>
        <h3 className="text-md font-lora text-white">{peak.peak_name}</h3>
        <p className="text-sm text-gray-300">
          Data: {formatDate(peak.visited_at)}
        </p>
        <a className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/40 transition-all duration-200 cursor-pointer">
          Zobacz więcej
        </a>
      </div>
    ))
  );
};

export default MyPeaksUser;
