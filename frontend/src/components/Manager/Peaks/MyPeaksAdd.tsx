import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faChevronDown,
  faXmark,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef, useContext } from "react";
import peaksService from "../../../services/peaks.service";
import userpeaksService from "../../../services/userpeaks.service";
import { Peaks } from "../../../assets/Data";
import AuthContext from "../../../store/auth-context";
import useGetUsers from "../../../hooks/user/useGetUser";
import filesService from "../../../services/files.service";
import ToastModalContext from "../../../store/toast-modal-context";

const MyPeaksAdd = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Peaks[]>([]);
  const [delayedSearchTerm, setDelayedSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData } = useGetUsers();
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const { createToast } = useContext(ToastModalContext);

  const [formData, setFormData] = useState({
    name: "",
    elevation: "",
    latitude: "",
    longitude: "",
    region: "",
    description: "",
    photo_url: "",
  });

  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);

  useEffect(() => {
    const currentUser = usersData?.[0]?.[0];
    if (currentUser?.id) {
      setUserId(currentUser.id);
    }
  }, [usersData]);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDelayedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  useEffect(() => {
    if (delayedSearchTerm) {
      peaksService
        .searchPeaks(delayedSearchTerm)
        .then((response) => {
          setResults(response.data.data || []);
          setShowResults(true);
        })
        .catch((error) => {
          console.error("Error searching peaks:", error);
          setResults([]);
          setShowResults(false);
        });
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [delayedSearchTerm]);

  const selectPeak = (peak: Peaks) => {
    setSearchTerm(peak.name);
    setShowResults(false);
    peaksService.getById(peak.id.toString()).then((response) => {
      const details = response.data.data;
      if (details) {
        setFormData({
          name: details.name || "",
          elevation: details.elevation?.toString() || "",
          latitude: details.latitude?.toString() || "",
          longitude: details.longitude?.toString() || "",
          region: details.region || "",
          description: details.description || "",
          photo_url: details.photo_url || "",
        });
        if (details.image_filename) {
          setSelectedFileName(details.image_filename);
        }
      }
    });
  };
  const clearForm = () => {
    setSearchTerm("");
    setSelectedImage(null);
    setSelectedFileName("");
    setFormData({
      name: "",
      elevation: "",
      latitude: "",
      longitude: "",
      region: "",
      description: "",
      photo_url: "",
    });
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    const value = e.target.value;

    setFormData({
      ...formData,
      [field]: value,
    });
    if (field === "name") {
      setSearchTerm(value);
    }
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setSelectedFileName(file.name);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let peakId: number | null = null;

      const existingPeak = results.find((peak) => peak.name === formData.name);

      if (existingPeak) {
        peakId = existingPeak.id;
      } else {
        const newPeak: Partial<Peaks> = {
          name: formData.name,
          elevation: parseFloat(formData.elevation),
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          region: formData.region,
          verified: false,
        };

        const response = await peaksService.create(newPeak);
        if (!response?.data?.data) {
          alert("Błąd podczas tworzenia szczytu.");
          return;
        }

        peakId = response.data.data.id;
      }

      if (!userId || !peakId) {
        alert("Brakuje ID użytkownika lub szczytu.");
        return;
      }

      let uploadedFilename: string | null = null;

      // Upload zdjęcia jeśli jest
      if (selectedImage) {
        const uploadRes = await filesService.uploadPeakImage(selectedImage);
        uploadedFilename = uploadRes.data?.file?.filename;

        if (!uploadedFilename) {
          console.error("Nie udało się uzyskać nazwy pliku.");
          return;
        }
      }
      await userpeaksService.addPeakUsers(
        peakId,
        userId,
        formData.description,
        uploadedFilename ?? "",
      );

      createToast({
        message: "Szczyt został pomyślnie dodany!",
        type: "primary",
        icon: faCamera,
        timeout: 5000,
      });
      clearForm();
    } catch (error) {
      console.error("Błąd dodawania szczytu:", error);
      createToast({
        message: "Nie udało się uzyskać identyfikatora użytkownika lub szczytu.",
        type: "danger",
        icon: faCircleExclamation,
        timeout: 5000,
        onClose: () => console.log("Toast closed"),
      });
    }
  };

  return (
    <div className="flex-col justify-center items-center bg-white/10 backdrop-blur-lg border-solid border-1 border-white/20 w-full rounded-lg shadow-xl mx-auto transition-all duration-300 overflow-hidden">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center pt-5 pb-3 px-6 cursor-pointer hover:bg-white/5 transition-all "
      >
        <h1 className="block text-3xl font-lora text-white pb-2">
          Dodaj szczyt
        </h1>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-white text-xl transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className={`w-full px-6 overflow-hidden transition-all duration-300 ease-in-out  ${isOpen ? "max-h-screen opacity-100 pb-6 mt-3" : "max-h-0 opacity-0 pb-0"}`}
      >
        <div className="flex flex-row w-full justify-between items-start gap-6">
          <div className="flex flex-col w-1/2 justify-start items-start">
            <div className="relative w-full mb-4" ref={searchRef}>
              <div className="relative flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setSearchTerm(newValue);
                    handleInputChange(e, "name");
                  }}
                  onFocus={() => results.length > 0 && setShowResults(true)}
                  required
                  placeholder="Nazwa szczytu"
                  className="w-full p-3 pr-10 text-white bg-white/5 rounded-md focus:border-none outline-0 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={clearForm}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
              </div>
              {showResults && results.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-black/50 backdrop-blur-lg border border-white/20 rounded-md shadow-lg max-h-60 overflow-y-auto scrollbar-hidden">
                  {results.map((peak) => (
                    <div
                      key={peak.id}
                      className="p-2 hover:bg-white/20 cursor-pointer text-white border-b border-white/5"
                      onClick={() => selectPeak(peak)}
                    >
                      <div className="font-medium">{peak.name}</div>
                      <div className="text-xs text-gray-300">
                        {peak.elevation} m n.p.m. -{" "}
                        {peak.region || "Nieznany region"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              onChange={(e) => handleInputChange(e, "elevation")}
              value={formData.elevation}
              required
              placeholder="Wysokość (m n.p.m.)"
              className="w-full mb-4 p-3 text-white bg-white/5 rounded-md focus:border-none outline-0 transition-all"
            />
            <input
              type="text"
              onChange={(e) => handleInputChange(e, "latitude")}
              value={formData.latitude}
              required
              placeholder="Szerokość geograficzna"
              className="w-full mb-4 p-3 text-white bg-white/5 rounded-md focus:border-none outline-0 transition-all"
            />
            <input
              type="text"
              onChange={(e) => handleInputChange(e, "longitude")}
              value={formData.longitude}
              required
              placeholder="Długość geograficzna"
              className="w-full mb-4 p-3 text-white bg-white/5 rounded-md focus:border-none outline-0 transition-all"
            />
          </div>
          <div className="flex flex-col w-1/2 justify-start items-start">
            <input
              type="text"
              onChange={(e) => handleInputChange(e, "region")}
              value={formData.region}
              required
              placeholder="Region"
              className="w-full mb-4 p-3 text-white bg-white/5 rounded-md focus:border-none outline-0 transition-all"
            />
            <textarea
              placeholder="Krótki opis szczytu"
              onChange={(e) => handleInputChange(e, "description")}
              value={formData.description}
              className="w-full mb-4 p-3 text-white bg-white/5 rounded-md focus:border-none outline-0 transition-all min-h-[100px]"
            />

            <label
              htmlFor="image-upload"
              className="w-full mb-4 p-3 text-white bg-white/5 rounded-md flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              {selectedFileName ? (
                <span className="flex items-center text-green-300">
                  <FontAwesomeIcon icon={faCamera} className="mr-2" />
                  {selectedFileName}
                </span>
              ) : (
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faCamera} className="mr-2" />
                  Dodaj zdjęcie
                </span>
              )}
            </label>
          </div>
        </div>

        <div className="flex justify-center mt-4 ">
          <button
            type="submit"
            className="py-3 px-6 text-white font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-all shadow-lg flex items-center"
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className="mr-2 rotate-[-90deg]"
            />
            Dodaj szczyt
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyPeaksAdd;
