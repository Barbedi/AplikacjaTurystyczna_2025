import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faUser,
  faEnvelope,
  faPersonHiking,
  faPersonRunning,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../store/auth-context";
import useGetUsers from "../../hooks/user/useGetUser";
import useUpdateUser from "../../hooks/user/useUpdateUser";
import filesService from "../../services/files.service";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData, loading } = useGetUsers();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { updateUserImg } = useUpdateUser();
  const { refreshUserProfile } = useContext(AuthContext);

  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);

  const currentUser = usersData?.[0][0];

  useEffect(() => {
    if (currentUser?.profile_image) {
      setPreviewUrl(filesService.getImgUrl(currentUser.profile_image));
    }
  }, [currentUser]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser?.id) return;

    // Maksymalny rozmiar pliku (np. 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error("Plik jest zbyt duży. Maksymalny rozmiar to 5MB.");
      return;
    }

    try {
      const response = await filesService.upload(file);
      const filename = response.data.file?.filename;

      if (!filename) throw new Error("Brak nazwy pliku w odpowiedzi");

      const imageUrl = filesService.getImgUrl(filename);
      setPreviewUrl(imageUrl);

      await updateUserImg(currentUser.id, filename);
      refreshUserProfile();
    } catch (err) {
      console.error("Błąd podczas przesyłania pliku:", err);
    }
  };

  return (
    <div className="w-full mx-5 mt-3">
      {loading && <p className="text-white">Ładowanie danych profilu...</p>}
      {!loading && currentUser && (
        <>
          <div
            className="flex flex-row items-start justify-center h-auto cursor-pointer"
            onClick={handlePhotoClick}
          >
            <div className="bg-black w-32 h-32 rounded-full flex items-center justify-center mt-4 overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Podgląd zdjęcia profilowego"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleUser}
                  className="text-[160px] text-white"
                />
              )}
            </div>
          </div>

          <div className="flex flex-row items-start justify-center mt-7">
            <button
              onClick={handlePhotoClick}
              className="bg-secondary rounded-2xl px-4 py-1 text-xl font-lora text-center cursor-pointer"
            >
              <span className="text-white">Dodaj zdjęcie</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex flex-row w-full items-start justify-center mt-4 gap-4 ">
            <div className="flex flex-col w-1/2 justify-start items-start border-r border-gray-300 p-4 pb-30">
              <div className="flex flex-col w-full relative border-b-2 border-white">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
                />
                <input
                  type="text"
                  id="name"
                  value={currentUser.name}
                  readOnly
                  className="w-full py-4 ml-4 border-none bg-transparent text-white placeholder-white focus:outline-none"
                />
              </div>
              <div className="flex flex-col w-full relative border-b-2 border-white">
                <input
                  type="email"
                  id="email"
                  value={currentUser.email}
                  readOnly
                  className="w-full py-4 ml-4 border-none bg-transparent text-white placeholder-white focus:outline-none"
                />
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
                />
              </div>
              <div className="flex flex-col w-full relative border-b-2 border-white">
                <select
                  disabled
                  className="w-full py-4 ml-4 border-none bg-transparent text-white focus:outline-none appearance-none"
                  value={currentUser.level_of_experience}
                >
                  <option value="">Wybierz poziom doświadczenia</option>
                  <option value="beginner">Początkujący</option>
                  <option value="intermediate">Średniozaawansowany</option>
                  <option value="advanced">Zaawansowany</option>
                  <option value="expert">Ekspert</option>
                  <option value="pro">Profesjonalista</option>
                </select>
                <FontAwesomeIcon
                  icon={faPersonHiking}
                  className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
                />
              </div>
              <div className="flex flex-col w-full relative border-b-2 border-white mb-5">
                <select
                  disabled
                  className="w-full py-4 ml-4 border-none bg-transparent text-white focus:outline-none appearance-none"
                  value={currentUser.fitness_level}
                >
                  <option value="">Wybierz poziom wysportowania</option>
                  <option value="beginner">Brak aktywności</option>
                  <option value="intermediate">
                    Aktywności 1 - 2 razy w tygodniu
                  </option>
                  <option value="advanced">
                    Aktywności 3 - 4 razy w tygodniu
                  </option>
                  <option value="expert">
                    Aktywności 5 - 6 razy w tygodniu
                  </option>
                  <option value="pro">Aktywności codziennie</option>
                </select>
                <FontAwesomeIcon
                  icon={faPersonRunning}
                  className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
                />
              </div>
            </div>
            <div className="flex flex-row w-1/2">
              <div className="flex flex-col w-full justify-start items-start ">
                <span className="text-2xl font-lora text-center text-white mt-3">
                  Aktywność
                </span>
                <div className="flex flex-col w-full justify-start text-lg items-start mt-4 text-wrap text-white">
                  <p>
                    02.07.2025 Utworzyłeś i zapisałeś trasę “nazwa Trasy” w
                    ulubionych{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyProfile;
