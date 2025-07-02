import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faUser, faEnvelope,faPersonHiking,faPersonRunning } from "@fortawesome/free-solid-svg-icons";

const MyProfile = () => {
  return (
    <div className="w-full">
      <div className="flex flex-row items-start justify-center h-auto">
        <div className="bg-black w-32 h-32 rounded-full flex items-center justify-center mt-4">
          <FontAwesomeIcon icon={faCircleUser} className="text-[160px] text-white" />
        </div>
      </div>
      <div className="flex flex-row items-start justify-center mt-7">
        <button className="bg-secondary rounded-2xl px-4 py-1 text-2xl font-lora text-center cursor-pointer">
          <span className="text-white">Dodaj zdjecie</span>
        </button>
      </div>
      <div className="flex flex-row w-full items-start justify-center mt-4 gap-4">
        <div className="flex flex-col w-1/2 justify-start items-start border-r border-gray-300 p-4">
          <div className=" flex flex-col w-full relative border-b-2 border-white">
            <FontAwesomeIcon
              icon={faUser}
              className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none "
            />
            <input
              type="text"
              id="name"
              placeholder="Nazwa użytkownika"
              required
              minLength={3}
              className="w-full py-4 ml-4 border-none bg-transparent placeholder-white text-white focus:outline-none"
            />
            
          </div>
          <div className=" flex flex-col w-full relative border-b-2 border-white">
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              required
              minLength={3}
              className="w-full py-4 ml-4 border-none bg-transparent placeholder-white text-white focus:outline-none"
            />
            <FontAwesomeIcon
              icon={faEnvelope}
              className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
            />
          </div>
            <div className="flex flex-col w-full relative border-b-2 border-white">
            <select
              id=""
              className="w-full py-4 ml-4 border-none bg-transparent text-white focus:outline-none appearance-none"
              defaultValue=""
            >
              <option value="" disabled>
              Wybierz poziom doświadczenia
              </option>
              <option value="beginner" className="text-white bg-accent">Początkujący</option>
              <option value="intermediate" className="text-white bg-accent">Średniozaawansowany</option>
              <option value="advanced" className="text-white bg-accent">Zaawansowany</option>
              <option value="expert" className="text-white bg-accent">Ekspert</option>
              <option value="pro" className="text-white bg-accent">Profesjonalista</option>
            </select>
            <FontAwesomeIcon
              icon={faPersonHiking}
              className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
            />
            </div>
            <div className="flex flex-col w-full relative border-b-2 border-white mb-6">
            <select
              id=""
              className="w-full py-4 ml-4 border-none bg-transparent text-white focus:outline-none appearance-none"
              defaultValue=""
            >
              <option value="" disabled>
              Wybierz poziom wysportowania
              </option>
              <option value="beginner" className="text-white bg-accent">Początkujący</option>
              <option value="intermediate" className="text-white bg-accent">Średniozaawansowany</option>
              <option value="advanced" className="text-white bg-accent">Zaawansowany</option>
              <option value="expert" className="text-white bg-accent">Ekspert</option>
              <option value="pro" className="text-white bg-accent">Profesjonalista</option>
            </select>
            <FontAwesomeIcon
              icon={faPersonRunning}
              className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
            />
            </div>
        </div>
        
        <div className="flex flex-row w-1/2">
          aktywności(logi)
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
