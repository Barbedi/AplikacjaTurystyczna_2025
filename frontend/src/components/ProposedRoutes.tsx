import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const routes = [
  {
    image: "/assets/img/FullSizeRender.JPG",
    pasmo: "Tatry",
    start: "Stacja Metra",
    end: "Biblioteka Miejska",
    length: "20 km",
    time: "9 h",
    elevation: "1000 m",
    difficulty: "Średni",
    rating: 4,
  },
  {
    image: "/assets/img/FullSizeRender.JPG",
    pasmo: "Tatry",
    start: "Kuźnice",
    end: "Rysy",
    length: "11 km",
    time: "6 h",
    elevation: "1300 m",
    difficulty: "Trudny",
    rating: 5,
  },
  {
    image: "/assets/img/FullSizeRender.JPG",
    pasmo: "Beskid Sądecki",
    start: "Rytro",
    end: "Radziejowa",
    length: "13 km",
    time: "5 h",
    elevation: "850 m",
    difficulty: "Średni",
    rating: 2,
  },
];

const ProposedRoutes = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center  py-8">
      <div className="flex items-center justify-center">
        <h1 className="text-3xl sm:text-4xl text-black font-lora">
          Proponowane trasy
        </h1>
      </div>
      <div className="flex flex-col md:flex-row mt-6 w-full px-4 sm:px-0 justify-center items-center gap-4">
        {routes.map((route, index) => (
          <div
            key={index}
            className="flex flex-col w-full md:w-1/2 xl:w-1/4 h-auto bg-secondary rounded-xl p-6 mx-2 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg"
          >
            <img className="rounded-xl" src={route.image} alt="" />
            <p className="text-sm sm:text-base md:text-lg mb-2">
              Pasmo górskie: {route.pasmo}
            </p>
            <p className="text-sm sm:text-base md:text-lg mb-2">
              Punkt startowy: {route.start}
            </p>
            <p className="text-sm sm:text-base md:text-lg mb-2">
              Punkt docelowy: {route.end}
            </p>

            <p className="text-sm sm:text-base md:text-lg mb-2">
              Długość trasy: {route.length}
            </p>
            <p className="text-sm sm:text-base md:text-lg mb-2">
              Czas przejścia: {route.time}
            </p>
            <p className="text-sm sm:text-base md:text-lg mb-2">
              Przewyższenie: {route.elevation}
            </p>
            <p className="text-sm sm:text-base md:text-lg mb-2">
              Stopień trudności: {route.difficulty}
            </p>

            <p className="text-sm sm:text-base md:text-lg mb-2">
              Ocena:
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={faStar}
                  className={`mx-1 ${i < route.rating ? "text-yellow-500" : "text-gray-400"}`}
                />
              ))}
            </p>
            <div className="flex flex-col mt-8 justify-center items-center">
              <a
                href="/"
                className="bg-white text-black text-sm sm:text-base px-4 py-2 rounded-md w-full sm:w-1/2 flex justify-center items-center hover:bg-gray-700 transition duration-300 font-lora"
              >
                Pokaż trasę{" "}
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProposedRoutes;
