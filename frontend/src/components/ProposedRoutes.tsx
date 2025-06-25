import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

// const routes = [
//   {
//     image: "/assets/img/IMG_5962.jpg",
//     pasmo: "Tatry",
//     start: "Stacja Metra",
//     end: "Biblioteka Miejska",
//     length: "20 km",
//     time: "9 h",
//     elevation: "1000 m",
//     difficulty: "Średni",
//     rating: 4,
//   },
// ];

const ProposedRoutes = () => {
  return (
    <div className="w-full flex flex-wrap md:flex-nowrap xl:items-start items-center justify-center md:justify-between py-8 px-4">
      <div className="relative w-full md:w-[40%] lg:w-[35%] xl:w-[30%] mx-4 mb-8 group self-start xl:items-center xl:text-center">
        <div className="absolute bg-accent/60 z-0 left-7 top-5 w-full h-full rounded-2xl" />
        <img
          className="rounded-2xl relative z-10 w-full object-cover shadow-2xl  mr-8"
          src="/assets/img/IMG_5962.jpg"
          alt="Trasa"
        />
      </div>
      <div className="flex flex-col items-start w-full md:w-[50%] lg:w-[55%] xl:w-[60%] self-start font-lora mx-4">
        <h1 className="text-2xl md:text-3xl xl:text-4xl mb-10 text-white leading-tight">
          Hala Ornak – Starorobociański Wierch
        </h1>

        <span className="text-white text-lg md:text-xl mb-2">
          Długość trasy: 12 km
        </span>
        <span className="text-white text-lg md:text-xl mb-2">
          Przewyższenie: 890 m
        </span>
        <span className="text-white text-lg md:text-xl mb-2">
          Liczba komentarzy: 24
        </span>
        <span className="text-white text-lg md:text-xl mb-10">
          Ocena trasy: 4.7 / 5
        </span>

        <a
          href="/"
          className="bg-secondary transition-colors rounded-2xl px-6 py-2 text-xl md:text-2xl text-black font-lora mt-auto flex items-center group"
        >
          Planuj trasę
          <FontAwesomeIcon
            icon={faChevronRight}
            className="ml-4 group-hover:translate-x-1 transition-transform duration-300"
          />
        </a>
      </div>
    </div>
  );
};

export default ProposedRoutes;
