const regions = [
  { name: "Beskidzie Sadeckim", path: "/region1" },
  { name: "Tatrach", path: "/region2" },
  { name: "Beskidzie Wyspowym", path: "/region3" },
];

const ExploreRoutes = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-8 pl-8 ">
    <div className="mt-4 flex flex-row flex-wrap  justify-center xl:gap-40 gap-10 text-white ">
      {regions.map((region) => (
        <a
          key={region.name}
          href={region.path}
          className="flex flex-col items-center p-4 hover:scale-105 duration-300 ease-in-out hover:underline decoration-2 "
        >
          <img
            className="xl:w-100 xl:h-100 lg:w-80 lg:h-80 md:w-60 md:h-60 rounded-full object-cover  "
            src="/assets/img/FullSizeRender.JPG"
            alt="Profilowe zdjęcie"
          />
          <h2 className="text-2xl xl:text-4xl font-lora text-white mt-3 text-center">
            {region.name}
          </h2>
        </a>
      ))}
    </div>
  </div>
  
  );
};

export default ExploreRoutes;
