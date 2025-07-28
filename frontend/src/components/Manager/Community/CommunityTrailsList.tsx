import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import communitytrailsService from "../../../services/communitytrails.service";
import { ExtendedCommunityTrails } from "../../../assets/Data";
import { formatDate } from "../../../utils/format";
import { useNavigate } from "react-router-dom";
import filesService from "../../../services/files.service";

const CommunityTrailsList = () => {
  const navigate = useNavigate();
  const [shared, setShared] = useState<ExtendedCommunityTrails[]>([]);

  useEffect(() => {
    const fetchCommunityTrails = async () => {
      try {
        const response = await communitytrailsService.getCommunityTrails();
        setShared(response.data);
        console.log("Odebrane dane:", response.data);
      } catch (error) {
        console.error("Error fetching community trails:", error);
      }
    };

    fetchCommunityTrails();
  }, []);

  const handleDetails = (sharedTrailId: number) => {
    navigate(`/dashboard/community-trails/${sharedTrailId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-5 mx-auto">
      {shared.map((sharedTrail) => (
        <div
          key={sharedTrail.shared_id}
          className=" flex bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-4 mt-5 transition-all duration-300 ease-in-out border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-xl w-full"
        >
          <span className="flex-1  text-lg font-lora text-white flex items-center gap-3">
            <img
              src={filesService.getImgUrl(sharedTrail.user_profile_image as string) || ""}
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
          </span>
        </div>
      ))}
    </div>
  );
};

export default CommunityTrailsList;
