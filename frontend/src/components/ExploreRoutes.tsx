import { useState } from "react";
import { useNavigate } from "react-router-dom";

const regions = [
  {
    name: "Beskidzie Sadecki",
    path: "Beskid Sądecki",
    image: "/assets/img/FullSizeRender.webp",
  },
  { name: "Tatrach", path: "Tatry", image: "/assets/img/IMG_6488.webp" },
  {
    name: "Beskidzie Wyspowym",
    path: "Beskid Wyspowy",
    image: "/assets/img/FullSizeRender2.webp",
  },
];

const ExploreRoutes = () => {
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleRegionClick = (regionPath: string) => {
    navigate(`/discover/${regionPath}`);
  };

  const handleImageLoad = (name: string) => {
    setLoadedImages((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 pl-8 ">
      <div className="mt-4 flex flex-row flex-wrap  justify-center xl:gap-40 gap-10 text-white ">
        {regions.map((region) => (
          <div
            key={region.name}
            onClick={() => handleRegionClick(region.path)}
            className="flex flex-col items-center p-4 hover:scale-105 duration-300 ease-in-out hover:underline decoration-2 cursor-pointer"
          >
            <div className="relative 2xl:w-100 2xl:h-100 xl:w-64 xl:h-64 lg:w-50 lg:h-50 md:w-40 md:h-40 rounded-full overflow-hidden">
              {!loadedImages[region.name] && (
                <div className="absolute inset-0 bg-slate-700 rounded-full animate-pulse" />
              )}
              <img
                loading="lazy"
                onLoad={() => handleImageLoad(region.name)}
                className={`w-full h-full rounded-full object-cover transition-opacity duration-500 ${
                  loadedImages[region.name] ? "opacity-100" : "opacity-0"
                }`}
                src={region.image}
                alt={`Region ${region.name}`}
              />
            </div>
            <h2 className="text-2xl xl:text-4xl font-lora text-white mt-3 text-center">
              {region.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreRoutes;