import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import communitytrailsService from "../../services/communitytrails.service";
import userService from "../../services/user.service";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { ExtendedCommunityTrails, Trails } from "../../assets/Data";
import filesService from "../../services/files.service";
import { timeAgo } from "../../utils/format";
import trailsService from "../../services/trails.service";
import likeTrailService from "../../services/LikeTrail.service";
import CommentSection from "../../components/Manager/Community/CommentSection";

const CommunityTrails = () => {
  const navigate = useNavigate();
  const [trail, setTrail] = useState<ExtendedCommunityTrails | null>(null);
  const [trailsData, setTrailsData] = useState<Trails[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [likedByUser, setLikedByUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const { id: sharedTrailId } = useParams<{ id: string }>();

  const fetchData = useCallback(async () => {
    if (!sharedTrailId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [trailResponse, likeResponse] = await Promise.all([
        communitytrailsService.getCommunityTrailDetails(
          parseInt(sharedTrailId, 10),
        ),
        likeTrailService.getLikesInfo(parseInt(sharedTrailId, 10)),
      ]);

      const trailData = trailResponse.data;
      setTrail(trailData);
      setLikesCount(likeResponse.data.totalLikes);
      setLikedByUser(likeResponse.data.likedByUser);

      const [trailDetails, userResponse] = await Promise.all([
        trailsService.getTrailById(trailData.trail_id),
        userService.getById(trailData.user_id),
      ]);

      setTrailsData([trailDetails.data]);
      const userData = userResponse.data.data[0];
      setPreviewUrl(filesService.getImgUrl(userData.profile_image));
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sharedTrailId]);

  useEffect(() => {
    fetchData();
    return () => {
      setTrail(null);
      setTrailsData([]);
      setPreviewUrl(null);
      setLikesCount(0);
      setLikedByUser(false);
    };
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-white">Ładowanie...</div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-white">Nie znaleziono trasy</div>
      </div>
    );
  }

  const handleEditTrail = () => {
    navigate(`/dashboard/community-trails/edit/${trail?.trail_id}`);
  };

  const handleLikeTrail = async () => {
    if (!trail) return;
    try {
      const response = await likeTrailService.likeTrail(trail.shared_id);
      if (response.status === 201) {
        setLikedByUser(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error liking trail:", error);
    }
  };

  const handleUnlikeTrail = async () => {
    if (!trail) return;
    try {
      const response = await likeTrailService.unlikeTrail(trail.shared_id);
      if (response.status === 200) {
        setLikedByUser(false);
        setLikesCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error unliking trail:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto  w-full">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 mb-6 overflow-hidden hover:shadow-lg transition-all duration-300 hover:bg-white/15">
        <div className="p-6 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              className="rounded-full h-12 w-12 object-cover ring-2 ring-white/30"
              src={previewUrl || ""}
              alt="User Avatar"
            />
            <div className="flex flex-col">
              <span className="text-white font-medium">{trail?.user_name}</span>
              <span className="text-gray-300 text-sm">
                {timeAgo(trail?.created_at || "")}
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <FontAwesomeIcon
                icon={faThumbsUp}
                title="Polubienia"
                onClick={likedByUser ? handleUnlikeTrail : handleLikeTrail}
                className={`text-2xl cursor-pointer ${likedByUser ? "text-red-500" : "text-white"}`}
              />
              <span className="text-white text-lg">{likesCount}</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-3">
            {trail?.trail_name}
          </h3>
          <p className="text-gray-300 mb-5">
            {trail?.shared_description || "Brak opisu trasy."}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Długość</p>
              <p className="text-white font-medium">
                {trailsData[0]?.length_km || "Brak danych"}
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Czas przejścia</p>
              <p className="text-white font-medium">
                {Math.floor((trailsData[0]?.duration_minutes as number) / 60)} h{" "}
                {(trailsData[0]?.duration_minutes as number) % 60} min
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Przewyższenie</p>
              <p className="text-white font-medium">
                {trailsData[0]?.elevation_gain || "Brak danych"} m
              </p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Trudność</p>
              <p className="text-white font-medium">
                {trailsData[0]?.difficulty || "Brak danych"}
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={handleEditTrail}
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              Zobacz trasę
            </button>
          </div>
        </div>
      </div>
      <CommentSection sharedTrailId={trail.shared_id} />
    </div>
  );
};
export default CommunityTrails;
