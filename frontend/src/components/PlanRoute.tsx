import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HikingIcon from "@mui/icons-material/Hiking";
import AssistantPhotoIcon from "@mui/icons-material/AssistantPhoto";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";


const PlanRoute = () => {
  return (
    <div className="flex flex-col md:flex-row items-stretch justify-between font-lora lg:gap-8 gap-5 w-full">
            <div className="text-white w-full md:w-1/4 group flex flex-col items-center text-center h-full">
              <HikingIcon
                sx={{ fontSize: 90 }}
                className="text-white mb-4 group-hover:animate-bounce duration-300 transition-all"
              />
              <h1 className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl mb-4 duration-300">
                Wybierz punkt startowy
              </h1>
              <span className="text-xl 2xl:text-2xl">
                Kliknij na mapie miejsce lub wpisz miejsce, z którego chcesz
                wyruszyć.
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
  );
};

export default PlanRoute;
