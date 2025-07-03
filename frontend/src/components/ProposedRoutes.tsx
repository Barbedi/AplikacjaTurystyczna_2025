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
    <div className="relative w-full md:w-[40%] lg:w-[35%] xl:w-[30%]  group hover:scale-105 duration-300 self-start xl:items-center xl:text-center pb-10 bg-accent/60 rounded-2xl shadow-2xl overflow-hidden">
      <img
        className="w-full h-auto object-cover"
        src="/assets/img/IMG_5962.jpg"
        alt="Trasa"
      />
      <div className="flex flex-col items-center text-center px-4 py-6 font-lora text-white">
        <h1 className="text-xl md:text-2xl xl:text-3xl font-lora leading-tight mb-4">
          Hala Ornak – Starorobociański Wierch
        </h1>
        <div className="w-1/2 border-t border-white mb-4"></div>
        <p className="text-md mb-6">
          Wymagająca, ale niezwykle malownicza trasa dla doświadczonych
          piechurów. Idealna na całodniową wyprawę z widokiem na Tatry
          Zachodnie.
        </p>
        <a
          href="/"
          className="bg-secondary rounded-2xl px-8 py-2 text-black text-2xl font-lora"
        >
          Zobacz trasę
          <FontAwesomeIcon
            icon={faChevronRight}
            className="ml-4 group-hover:translate-x-2 font-lora mt-1 duration-300 transition-all"
          />
        </a>
      </div>
    </div>
  );
};

export default ProposedRoutes;
