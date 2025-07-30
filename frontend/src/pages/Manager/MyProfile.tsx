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
import { Users, User_Activities, PageData } from "../../assets/Data";
import logsService from "../../services/logs.service";
import UserActivity from "../../components/Manager/User/UserActivity";
import { useSearchParams } from "react-router-dom";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData, loading } = useGetUsers();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { updateUserImg, updateUser } = useUpdateUser();
  const { refreshUserProfile } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<Users | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activities, setActivities] = useState<User_Activities[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageData, setPageData] = useState<PageData>({
    page: parseInt(searchParams.get("page") || "1"),
    pages: 1,
  });

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

  useEffect(() => {
    if (currentUser?.id) {
      logsService
        .getUserActivities(currentUser.id, pageData.page)
        .then((response) => {
          setActivities(response.data.data);
          setPageData((prev) => ({
            ...prev,
            pages: response.data.totalPages,
          }));
        })
        .catch((error) => {
          console.error("Error fetching user activities:", error);
        });
    }
  }, [currentUser, pageData.page]);

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || "1");
    if (pageData.page !== currentPage) {
      setSearchParams({ page: pageData.page.toString() });
    }
  }, [pageData.page, searchParams, setSearchParams]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser?.id) return;

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
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 mt-8">
      {!loading && currentUser && (
        <div className="">
          <div className=" px-6 relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div
                  className="group cursor-pointer relative"
                  onClick={handlePhotoClick}
                >
                  <div className="w-32 h-32 rounded-full shadow-lg ring-4 ring-white/20 overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Zdjęcie profilowe"
                        className="w-full h-full object-cover transition duration-300 group-hover:opacity-80"
                      />
                    ) : (
                      <div className="bg-white/10 w-full h-full flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faCircleUser}
                          className="text-7xl text-white/80"
                        />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="text-white text-sm font-medium">
                      Zmień zdjęcie
                    </span>
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-lora font-bold text-white">
                    {currentUser.name || "Użytkownik HikeUp"}
                  </h1>
                  <p className="text-white/70 mt-1">{currentUser.email}</p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex gap-2">
                {!editMode ? (
                  <button
                    onClick={handleEditMode}
                    className="bg-white/20 hover:bg-white/30 transition duration-300 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faGear} />
                    <span>Edytuj profil</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="bg-green-600/80 hover:bg-green-600 transition duration-300 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faSave} />
                      <span>{isSaving ? "Zapisywanie..." : "Zapisz"}</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-red-600/80 hover:bg-red-600 transition duration-300 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      <span>Anuluj</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-6 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-lora text-white mb-4 pb-2 border-b border-white/10">
                Dane profilu
              </h2>

              <div className="space-y-5">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-white/70 w-6"
                    />
                    <p className="text-white/70 ml-3">Imię i nazwisko</p>
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={editMode ? editedUser?.name : currentUser.name}
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    className={`w-full px-3 py-2 rounded-lg ${
                      editMode
                        ? "bg-white/10 border border-white/30"
                        : "bg-transparent"
                    } text-white placeholder-white focus:outline-none ${
                      editMode && "focus:border-accent"
                    }`}
                  />
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-white/70 w-6"
                    />
                    <p className="text-white/70 ml-3">Email</p>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={currentUser.email}
                    readOnly
                    className="`w-full px-3 py-2 rounded-lg text-white"
                  />
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon
                      icon={faPersonHiking}
                      className="text-white/70 w-6"
                    />
                    <p className="text-white/70 ml-3">Poziom doświadczenia</p>
                  </div>
                  <select
                    id="level_of_experience"
                    disabled={!editMode}
                    className={`w-full px-3 py-2 rounded-lg ${
                      editMode
                        ? "bg-white/10 border border-white/30"
                        : "bg-transparent"
                    } text-white placeholder-white focus:outline-none ${
                      editMode && "focus:border-accent"
                    }`}
                    value={
                      editMode
                        ? editedUser?.level_of_experience
                        : currentUser.level_of_experience
                    }
                    onChange={handleInputChange}
                  >
                    <option className="bg-gray-800" value="">
                      Wybierz poziom doświadczenia
                    </option>
                    <option className="bg-gray-800" value="beginner">
                      Początkujący
                    </option>
                    <option className="bg-gray-800" value="intermediate">
                      Średniozaawansowany
                    </option>
                    <option className="bg-gray-800" value="advanced">
                      Zaawansowany
                    </option>
                    <option className="bg-gray-800" value="expert">
                      Ekspert
                    </option>
                    <option className="bg-gray-800" value="pro">
                      Profesjonalista
                    </option>
                  </select>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon
                      icon={faPersonRunning}
                      className="text-white/70 w-6"
                    />
                    <p className="text-white/70 ml-3">Poziom wysportowania</p>
                  </div>
                  <select
                    id="fitness_level"
                    disabled={!editMode}
                    className={`w-full px-3 py-2 rounded-lg ${
                      editMode
                        ? "bg-white/10 border border-white/30"
                        : "bg-transparent"
                    } text-white placeholder-white focus:outline-none ${
                      editMode && "focus:border-accent"
                    }`}
                    value={
                      editMode
                        ? editedUser?.fitness_level
                        : currentUser.fitness_level
                    }
                    onChange={handleInputChange}
                  >
                    <option className="bg-gray-800" value="">
                      Wybierz poziom wysportowania
                    </option>
                    <option className="bg-gray-800" value="beginner">
                      Brak aktywności
                    </option>
                    <option className="bg-gray-800" value="intermediate">
                      Aktywności 1 - 2 razy w tygodniu
                    </option>
                    <option className="bg-gray-800" value="advanced">
                      Aktywności 3 - 4 razy w tygodniu
                    </option>
                    <option className="bg-gray-800" value="expert">
                      Aktywności 5 - 6 razy w tygodniu
                    </option>
                    <option className="bg-gray-800" value="pro">
                      Aktywności codziennie
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <UserActivity
                activities={activities}
                pageData={pageData}
                setPageData={setPageData}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
