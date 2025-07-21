import { useEffect, useState } from "react";
import trailsService from "../../services/trails.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Trails } from "../../assets/Data";
import { useNavigate } from "react-router-dom";




const TrailPropose = () => {
    const navigate = useNavigate();
    const [trails, setTrails] = useState<Trails[]>([]);
    useEffect(() => {
        const fetchTrails = async () => {
            try {
                const response = await trailsService.getTrailsByPublic();
                setTrails(response.data.data);
            } catch (error) {
                console.error("Error fetching trails:", error);
            }
        };

        fetchTrails();
    }, []);

    const handleTrailClick = (trailId: number) => {
        navigate(`/dashboard/recommended/${trailId}`);
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
            {trail.length_km} km
          </span>
          <span className="flex-1 text-lg font-lora text-white cursor-pointer">
            <FontAwesomeIcon
                onClick={() => handleTrailClick(trail.id)}
              icon={faChevronRight}
              className="text-white cursor-pointer text-lg"
              title="Zobacz szczegóły"
            />
          </span>
        </div>
      ))}
      
    </div>
    );
};

export default TrailPropose;