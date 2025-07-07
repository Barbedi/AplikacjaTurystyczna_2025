import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faUser,
  faEnvelope,
  faPersonHiking,
  faPersonRunning,
  faSave,
  faTimes,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../store/auth-context";
import useGetUsers from "../../hooks/user/useGetUser";
import useUpdateUser from "../../hooks/user/useUpdateUser";
import filesService from "../../services/files.service";
import { UserInfo } from "../../assets/Data";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData, loading } = useGetUsers();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { updateUserImg, updateUser } = useUpdateUser();
  const { refreshUserProfile } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<UserInfo | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
    if (currentUser) {
      setEditedUser(currentUser);
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

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    if (currentUser) {
      setEditedUser(currentUser);
    }
  };

  const handleSaveChanges = async () => {
    if (!editedUser || !currentUser?.id) return;

    setIsSaving(true);
    try {
      const message = await updateUser(currentUser.id, editedUser);
      if (message) {
        setEditMode(false);
        refreshUserProfile();
        getUserByEmail(user?.email || "");
      }
    } catch (error) {
      console.error("Error saving profile changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [id]: value,
      });
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

          <div className="flex flex-row items-start justify-center mt-7 gap-2">
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
              <div className="flex flex-row w-full items-end justify-end space-x-2">
                {!editMode && (
                  <button onClick={handleEditMode}>
                    <FontAwesomeIcon
                      icon={faGear}
                      className="text-2xl text-white cursor-pointer"
                    />
                  </button>
                )}
                {editMode && (
                  <>
                    <button onClick={handleSaveChanges} disabled={isSaving}>
                      <FontAwesomeIcon
                        icon={faSave}
                        className="text-2xl text-white hover:text-green-700 cursor-pointer "
                      />
                    </button>
                    <button onClick={handleCancelEdit}>
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="text-2xl text-red-700 cursor-pointer"
                      />
                    </button>
                  </>
                )}
              </div>
              <div className="flex flex-col w-full relative border-b-2 border-white">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
                />
                <input
                  type="text"
                  id="name"
                  value={editMode ? editedUser?.name : currentUser.name}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                  className={`w-full py-4 ml-4 border-none ${editMode ? "bg-[rgba(255,255,255,0.1)]" : "bg-transparent"} text-white placeholder-white ${
                    editMode ? "focus:outline-white" : "focus:outline-none"
                  } ${editMode ? "border-b-2 border-blue-500" : ""}`}
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
                  id="level_of_experience"
                  disabled={!editMode}
                  className={`w-full py-4 ml-4 border-none ${editMode ? "bg-[rgba(255,255,255,0.1)]" : "bg-transparent"} text-white ${
                    editMode
                      ? "focus:outline-white cursor-pointer"
                      : "focus:outline-none"
                  } appearance-none`}
                  value={
                    editMode
                      ? editedUser?.level_of_experience
                      : currentUser.level_of_experience
                  }
                  onChange={handleInputChange}
                >
                  <option className="bg-accent" value="">
                    Wybierz poziom doświadczenia
                  </option>
                  <option className="bg-accent" value="beginner">
                    Początkujący
                  </option>
                  <option className="bg-accent" value="intermediate">
                    Średniozaawansowany
                  </option>
                  <option className="bg-accent" value="advanced">
                    Zaawansowany
                  </option>
                  <option className="bg-accent" value="expert">
                    Ekspert
                  </option>
                  <option className="bg-accent" value="pro">
                    Profesjonalista
                  </option>
                </select>
                <FontAwesomeIcon
                  icon={faPersonHiking}
                  className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
                />
              </div>
              <div className="flex flex-col w-full relative border-b-2 border-white mb-5">
                <select
                  id="fitness_level"
                  disabled={!editMode}
                  className={`w-full py-4 ml-4 border-none ${editMode ? "bg-[rgba(255,255,255,0.1)]" : "bg-transparent"} text-white ${
                    editMode
                      ? "focus:outline-white cursor-pointer"
                      : "focus:outline-none"
                  } appearance-none`}
                  value={
                    editMode
                      ? editedUser?.fitness_level
                      : currentUser.fitness_level
                  }
                  onChange={handleInputChange}
                >
                  <option className="bg-accent" value="">
                    Wybierz poziom wysportowania
                  </option>
                  <option className="bg-accent" value="beginner">
                    Brak aktywności
                  </option>
                  <option className="bg-accent" value="intermediate">
                    Aktywności 1 - 2 razy w tygodniu
                  </option>
                  <option className="bg-accent" value="advanced">
                    Aktywności 3 - 4 razy w tygodniu
                  </option>
                  <option className="bg-accent" value="expert">
                    Aktywności 5 - 6 razy w tygodniu
                  </option>
                  <option className="bg-accent" value="pro">
                    Aktywności codziennie
                  </option>
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
                    02.07.2025 Utworzyłeś i zapisałeś trasę "nazwa Trasy" w
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
