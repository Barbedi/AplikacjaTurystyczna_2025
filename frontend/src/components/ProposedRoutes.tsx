import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const routes = [
  {
    image: "/assets/img/IMG_5962.jpg",
    pasmo: "Tatry",
    start: "Stacja Metra",
    end: "Biblioteka Miejska",
    length: "20 km",
    time: "9 h",
    elevation: "1000 m",
    difficulty: "Średni",
    rating: 4,
  }
];

const ProposedRoutes = () => {
  return (
    <div className="w-full flex flex-row items-center justify-center py-8">
      <div className="relative flex flex-row items-center text-center mb-8 w-1/3 mx-4">
        <div className="absolute bg-accent/60 z-0 left-7 top-5 w-full h-full rounded-2xl" />
        <img
          className="rounded-2xl mr-8 relative z-10"
          src="/assets/img/IMG_5962.jpg"
        />
      </div>
      <div className="flex flex-row items-start w-1/3 h-full relative z-10 justify-start mx-4">
        <h1 className="text-3xl ml-4 mb-4 text-white relative z-10 font-lora">
          Proponowane trasy
        </h1>
        </div>
    </div>
  );
};
export default ProposedRoutes;
