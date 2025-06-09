const regions = [
  { name: "Beskid Sadecki", path: "/region1" },
  { name: "Tatry", path: "/region2" },
  { name: "Beskid Wyspowy", path: "/region3" },
];

const ExploreRoutes = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center  bg-gray-100 py-8">
      <div className="flex items-center justify-center">
        <h1 className="text-3xl sm:text-4xl text-black font-lora">
          Odkryj Trasy w
        </h1>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-6 rounded-full  ">
        {regions.map((region) => (
          <a
            key={region.name}
            href={region.path}
            className="p-4  bg-gray-100 hover:scale-105 duration-300 ease-in-out hover:underline decoration-2 "
          >
            <img
              className="2xl:size-96 xl:size-60 rounded-full"
              src="/assets/img/FullSizeRender.JPG"
              alt=""
            />
            <h2 className="text-4xl font-lora text-gray-800 flex justify-center items-center mt-3 ">
              {region.name}
            </h2>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ExploreRoutes;
