import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HikingIcon from "@mui/icons-material/Hiking";
import AssistantPhotoIcon from "@mui/icons-material/AssistantPhoto";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-grad1 to-grad2 pb-24 md:pb-0">
      <Navbar />
      <div className="relative bg-[url('/assets/img/IMG_4048.JPG')] bg-cover bg-center bg-no-repeat h-[60vh] md:h-[70vh] w-[90%] mx-auto rounded-2xl shadow-xl my-3 overflow-hidden duration-300">
        <div className="relative z-20 flex flex-col items-start justify-center h-full px-6 md:px-16 text-white duration-300">
          <h1 className="text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl font-lora mb-6 duration-300">
            Wędrówka marzeń?
            <br />
            Znajdziesz ją z<br /> HikeUp!
          </h1>
          <div className="relative xl:w-1/3 md:w-1/2 duration-300 font-lora">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-xl pointer-events-none duration-300"
            />
            <input
              type="text"
              placeholder="Wyszukaj szlaku"
              className="bg-white/30 text-white placeholder-white outline-none w-full rounded-4xl px-4 py-3 text-xl md:text-2xl pl-10 duration-300"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center max-w-[2330px] mx-auto px-4">
        <div className="flex flex-col items-center text-center mt-6">
          <div className="text-white text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-lora mb-6 duration-300">
            Zaplanuj trasę
          </div>
          <div className="text-white  text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-lora mb-12 duration-300 text-wrap md:w-2/5 ">
            Twórz świadome i bezpieczne wyprawy dzięki przemyślanemu planowaniu.
          </div>
          <div className="flex flex-col md:flex-row items-stretch justify-between font-lora gap-8 w-full">
          <div className="text-white w-full md:w-1/4 group flex flex-col items-center text-center h-full">
            <HikingIcon
              sx={{ fontSize: 90 }}
              className="text-white mb-4 group-hover:animate-bounce duration-300 transition-all"
            />
            <h1 className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl mb-4 duration-300">
              Wybierz punkt startowy
            </h1>
            <span className="text-xl 2xl:text-2xl">
              Kliknij na mapie miejsce lub wpisz miejsce, z którego chcesz wyruszyć.
            </span>
          </div>
          <div className="text-white w-full md:w-1/4 group flex flex-col items-center text-center h-full">
            <AssistantPhotoIcon
              sx={{ fontSize: 90 }}
              className="text-white mb-4 group-hover:animate-bounce duration-300 transition-all"
            />
            <h1 className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl mb-4 duration-300">
              Dodaj punkty pośrednie (opcjonalnie)
            </h1>
            <span className="text-xl 2xl:text-2xl">
              Jeśli chcesz, dodaj przystanki lub ciekawe miejsca po drodze.
            </span>
          </div>
          <div className="text-white w-full md:w-1/4 group flex flex-col items-center text-center h-full">
            <FollowTheSignsIcon
              sx={{ fontSize: 90 }}
              className="text-white mb-4 group-hover:animate-bounce duration-300 transition-all"
            />
            <h1 className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl mb-4 duration-300">
              Dodaj punkt docelowy
            </h1>
            <span className="text-xl 2xl:text-2xl">
              Wybierz miejsce, do którego chcesz dojść.
            </span>
          </div>
          <div className="text-white w-full md:w-1/4 group flex flex-col items-center text-center h-full">
            <CheckCircleIcon
              sx={{ fontSize: 90 }}
              className="text-white mb-4 group-hover:animate-bounce duration-300 transition-all"
            />
            <h1 className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl mb-4 duration-300">
              Zatwierdź trasę i zapisz plan
            </h1>
            <span className="text-xl 2xl:text-2xl">
              Gotowe? Zapisz trasę i ruszaj na wyprawę z HikeUp!
            </span>
          </div>
        </div>
          <div className="flex justify-center items-center my-10 ">
            <button className="bg-secondary rounded-2xl px-10 py-3 text-2xl font-lora">
              Planuj trase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
