import { useNavigate } from "react-router-dom";

const regions = [
  {
    name: "Beskidzie Sadeckim",
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
  const handleRegionClick = (regionPath: string) => {
    navigate(`/discover/${regionPath}`);
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
            <img
              className="2xl:w-100 2xl:h-100 xl:w-64 xl:h-64 lg:w-50 lg:h-50 md:w-40 md:h-40 rounded-full object-cover"
              src={region.image}
              alt={`Region ${region.name}`}
            />
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
