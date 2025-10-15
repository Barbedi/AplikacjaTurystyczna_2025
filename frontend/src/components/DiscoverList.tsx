import { useEffect, useState } from "react";
import trailsService from "../services/trails.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Trails } from "../assets/Data";
import { useNavigate } from "react-router-dom";

const DiscoverList = () => {
  const navigate = useNavigate();
  const [trails, setTrails] = useState<Trails[]>([]);
  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const response = await trailsService.getTrailsByPublic();
  
        const data = response?.data?.data;
        if (Array.isArray(data)) {
          setTrails(data);
        } else {
          console.warn("⚠️ trailsService.getTrailsByPublic() zwróciło coś innego niż tablicę:", data);
          setTrails([]); // zabezpieczenie, żeby .map nie wywalił błędu
        }
      } catch (error) {
        console.error("❌ Błąd podczas pobierania szlaków:", error);
        setTrails([]); // zabezpieczenie w razie błędu
      }
    };
  
    fetchTrails();
  }, []);
  

  const handleTrailClick = (trailId: number) => {
    navigate(`/trails/${trailId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-5 mx-auto">
     {Array.isArray(trails) && trails.map((trail) => (
        <div
          key={trail.id}
          className={`flex bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-4 mt-5 transition-all duration-300 ease-in-out hover:shadow-xl w-full
             ${
               trail.region === "Tatry"
                 ? "border-2 border-purple-500/20 hover:bg-purple-500/30 "
                 : trail.region === "Beskid Sądecki"
                   ? "border-2 border-green-500/20 hover:bg-green-500/30 "
                   : "border border-gray-400"
             }`}
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

export default DiscoverList;
