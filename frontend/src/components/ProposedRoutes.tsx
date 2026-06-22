import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import trailsService from "../services/trails.service";
import filesService from "../services/files.service";
import { useEffect, useState } from "react";
import { Trails } from "../assets/Data";
import { useNavigate } from "react-router-dom";

const ProposedRoutes = () => {
  const navigate = useNavigate();
  const [trails, setTrails] = useState<Trails[]>([]);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const response = await trailsService.getRandomTrails(3);
        setTrails(response.data);
      } catch (error) {
        console.error("Error fetching trails:", error);
      }
    };

    fetchTrails();
  }, []);

  const handleTrailClick = (trailId: number) => {
    navigate(`trails/${trailId}`);
  };

  const handleImageLoad = (trailId: number) => {
    setLoadedImages((prev) => ({ ...prev, [trailId]: true }));
  };

  return (
    <>
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="relative w-full flex flex-col group hover:scale-105 duration-300 h-full xl:items-center xl:text-center pb-10 bg-accent/60 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="relative w-full h-60">
            {!loadedImages[trail.id] && (
              <div className="absolute inset-0 bg-slate-700 animate-pulse" />
            )}
            <img
              loading="lazy"
              onLoad={() => handleImageLoad(trail.id)}
              className={`w-full h-60 object-cover transition-opacity duration-500 ${
                loadedImages[trail.id] ? "opacity-100" : "opacity-0"
              }`}
              src={
                trail.main_photo
                  ? filesService.getTrailImgUrl(trail.main_photo)
                  : "/assets/img/IMG_5962.jpg"
              }
              alt={trail.name}
            />
          </div>
          <div className="flex flex-col items-center text-center px-4 py-6 font-lora text-white flex-grow">
            <h1 className="text-xl md:text-2xl xl:text-3xl font-lora leading-tight mb-4">
              {trail.name}
            </h1>
            <div className="w-1/2 border-t border-white mb-4"></div>
            <p className="text-md mb-6 flex-grow">
              {trail.description || "Brak opisu trasy."}
            </p>
            <div className="mt-auto">
              <a
                onClick={() => handleTrailClick(trail.id)}
                className="bg-secondary rounded-2xl px-8 py-2 text-black text-2xl font-lora cursor-pointer inline-block"
              >
                Zobacz trasę
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="ml-4 group-hover:translate-x-2 font-lora mt-1 duration-300 transition-all"
                />
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProposedRoutes;