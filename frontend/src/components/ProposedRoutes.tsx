import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const ProposedRoutes = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100 py-8">
      <div className="flex items-center justify-center">
        <h1 className="text-3xl sm:text-4xl text-black font-lora">
          Proponowane trasy
        </h1>
      </div>
      <div className="flex flex-row mt-6 w-full px-4 sm:px-0 justify-center items-center gap-4">
        <div className="flex flex-col w-full sm:w-1/2 xl:w-1/4 h-auto bg-secondary rounded-xl p-6 mx-2 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg">
          <img
            className="rounded-xl"
            src="/assets/img/FullSizeRender.JPG"
            alt=""
          />
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Pasmo górskie: Tatry
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Punkt startowy: Stacja Metra
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Punkt docelowy: Biblioteka Miejska
          </p>

          <p className="text-sm sm:text-base md:text-lg mb-2">
            Długość trasy: 20 km
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Czas przejścia: 9 h
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Przewyższenie: 1000 m
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Stopień trudności: Średni
          </p>

          <p className="text-sm sm:text-base md:text-lg mb-2">
            Ocena:
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mx-1" />
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mx-1" />
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mx-1" />
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mx-1" />
            <FontAwesomeIcon icon={faStar} className="text-gray-400 mx-1" />
          </p>
          <div className="flex flex-col mt-8 justify-center items-center">
            <a
              href="/"
              className="bg-white text-black text-sm sm:text-base px-4 py-2 rounded-md w-full sm:w-1/2 flex justify-center items-center"
            >
              Pokaż trasę{" "}
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </a>
          </div>
        </div>
        <div className="flex flex-col w-full sm:w-1/2 xl:w-1/4 h-auto bg-secondary rounded-xl p-6 mx-2 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg">
          <img
            className="rounded-xl"
            src="/assets/img/FullSizeRender.JPG"
            alt=""
          />
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Pasmo górskie: Tatry
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Punkt startowy: Stacja Metra
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Punkt docelowy: Biblioteka Miejska
          </p>

          <p className="text-sm sm:text-base md:text-lg mb-2">
            Długość trasy: 20 km
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Czas przejścia: 9 h
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Przewyższenie: 1000 m
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Stopień trudności: Średni
          </p>

          <p className="text-sm sm:text-base md:text-lg mb-2">
            Ocena:
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mx-1" />
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mx-1" />
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mx-1" />
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mx-1" />
            <FontAwesomeIcon icon={faStar} className="text-gray-400 mx-1" />
          </p>
          <div className="flex flex-col mt-8 justify-center items-center">
            <a
              href="/"
              className="bg-white text-black text-sm sm:text-base px-4 py-2 rounded-md w-full sm:w-1/2 flex justify-center items-center"
            >
              Pokaż trasę{" "}
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </a>
          </div>
        </div>
        <div className="flex flex-col w-full sm:w-1/2 xl:w-1/4 h-auto bg-secondary rounded-xl p-6 mx-2 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg">
          <img
            className="rounded-xl"
            src="/assets/img/FullSizeRender.JPG"
            alt=""
          />
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Pasmo górskie: Tatry
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Punkt startowy: Stacja Metra
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Punkt docelowy: Biblioteka Miejska
          </p>

          <p className="text-sm sm:text-base md:text-lg mb-2">
            Długość trasy: 20 km
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Czas przejścia: 9 h
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Przewyższenie: 1000 m
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-2">
            Stopień trudności: Średni
          </p>

          <p className="text-sm sm:text-base md:text-lg mb-2">
            Ocena:
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mx-1" />
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mx-1" />
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mx-1" />
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mx-1" />
            <FontAwesomeIcon icon={faStar} className="text-gray-400 mx-1" />
          </p>
          <div className="flex flex-col mt-8 justify-center items-center">
            <a
              href="/"
              className="bg-white text-black text-sm sm:text-base px-4 py-2 rounded-md w-full sm:w-1/2 flex justify-center items-center"
            >
              Pokaż trasę{" "}
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposedRoutes;
