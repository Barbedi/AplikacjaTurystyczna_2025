import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Peaks } from "../../assets/Data";
import peaksService from "../../services/peaks.service";
import userpeaksService from "../../services/userpeaks.service";
import filesService from "../../services/files.service";
import MapTrails from "../../components/Manager/Map/MapTrails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faMountainSun } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/format";
import useGetUsers from "../../hooks/user/useGetUser";
import AuthContext from "../../store/auth-context";
import exifr from 'exifr';
import { calculateDistance } from "../../utils/calculateDistance";

const emptyPeak: Peaks = {
  id: 0,
  name: "",
  elevation: 0,
  region: "",
  latitude: 0,
  longitude: 0,
  verified: false,
  image_filename: "",
};

const EditCrownPage = () => {
  const [peak, setPeak] = useState<Peaks>(emptyPeak);
  const [myPeak, setMyPeak] = useState<{
    description?: string;
    photoUrl?: string;
    visitedAt?: string;
  } | null>(null);

  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [userImagePreview, setUserImagePreview] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    distance?: number;
    error?: string;
  } | null>(null);
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData } = useGetUsers();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const pathname = location.pathname;

  const isCrownPeak = pathname.includes("/crown-peaks/");
  const isMyPeak = pathname.includes("/my-peaks/");
  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);

  const currentUser = usersData?.[0]?.[0];
  useEffect(() => {
    const fetchMyPeak = async () => {
      if (!currentUser?.id || !id || !isMyPeak) return;

      try {
        const response = await userpeaksService.getUserPeakById(
          currentUser.id,
          parseInt(id),
        );
        const userPeakData = response.data.data;

        setMyPeak({
          description: userPeakData.description,
          photoUrl: userPeakData.photo_url,
          visitedAt: userPeakData.visited_at,
        });
        if (userPeakData.photo_url) {
          setUserImagePreview(
            filesService.getPeakImgUrl(userPeakData.photo_url),
          );
        }

        if (userPeakData.rating) {
          setRating(userPeakData.rating);
        }
      } catch (error) {
        console.error("Error fetching user peak data:", error);
      }
    };

    fetchMyPeak();
  }, [currentUser?.id, id, isMyPeak]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      let canUpload = true;
      let tempVerificationResult = null;

      // Weryfikacja GPS dla CrownPeak
      if (isCrownPeak && peak.latitude && peak.longitude) {
        try {
          const gps = await exifr.gps(file);
          
          if (gps && gps.latitude && gps.longitude) {
            const distance = calculateDistance(
              gps.latitude, gps.longitude,
              peak.latitude, peak.longitude
            );
            
            if (distance <= 1000) {
              tempVerificationResult = { isValid: true, distance: Math.round(distance) };
              canUpload = true;
            } else {
              tempVerificationResult = { isValid: false, distance: Math.round(distance) };
              canUpload = false;
            }
          } else {
            tempVerificationResult = { isValid: false, error: 'Brak danych GPS w zdjęciu' };
            canUpload = false;
          }
        } catch {
          tempVerificationResult = { isValid: false, error: 'Błąd odczytu metadanych' };
          canUpload = false;
        }
        
        setVerificationResult(tempVerificationResult);
      }

      // Pokaż preview tylko jeśli weryfikacja przeszła lub to nie jest Crown Peak
      if (canUpload || !isCrownPeak) {
        const reader = new FileReader();
        reader.onload = () => {
          if (isCrownPeak) {
            setImagePreview(reader.result as string);
          } else if (isMyPeak) {
            setUserImagePreview(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      }

      // Upload tylko jeśli weryfikacja przeszła lub to nie jest Crown Peak
      if (canUpload || !isCrownPeak) {
        try {
          const response = await filesService.uploadPeakImage(file);
          const filename = response.data.file?.filename;

          if (filename && id) {
            if (isCrownPeak) {
              await peaksService.updateImage(id, filename);
              
              // Automatycznie ustaw status weryfikacji na podstawie GPS
              if (tempVerificationResult && tempVerificationResult.isValid) {
                try {
                  await peaksService.updateVerification(id, true);
                } catch (verificationError) {
                  console.error('Błąd podczas aktualizacji statusu weryfikacji:', verificationError);
                }
              }
              
              const peakResponse = await peaksService.getById(id);
              setPeak(peakResponse.data.data);
            } else if (isMyPeak && currentUser?.id) {
              setMyPeak((prev) =>
                prev ? { ...prev, photoUrl: filename } : null,
              );
            }
          }
        } catch (error) {
          console.error("Błąd podczas uploadowania zdjęcia:", error);
        }
      } else {
        // Zresetuj preview jeśli upload był anulowany
        setImagePreview("");
      }
    }
  };

  const handleStarClick = (starNumber: number) => {
    setRating(starNumber);
  };

  const handleStarHover = (starNumber: number) => {
    setHoveredStar(starNumber);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  useEffect(() => {
    const fetchPeakData = async () => {
      if (!id) {
        console.error("ID is not provided");
        return;
      }

      try {
        const response = await peaksService.getById(id);
        const peakData = response.data.data;
        setPeak(peakData);

        if (isCrownPeak && peakData.image_filename) {
          const imageUrl = filesService.getPeakImgUrl(peakData.image_filename);
          setImagePreview(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching peak data:", error);
      }
    };

    fetchPeakData();
  }, [id, isCrownPeak]);

  // const handleAddReview = async () => {
  //   if (!currentUser?.id || !id) return;
  //   try {
  //     const review: Review = {
  //       user_id: currentUser.id,
  //       peak_id: parseInt(id),
  //       comment: reviewText,
  //       rating: rating > 0 ? rating : undefined,
  //     };
  //     await reviewService.createReview(review);
  //     setOpenModal(false);
  //     setReviewText(""); // wyczyszczenie textarea po dodaniu
  //   } catch (error) {
  //     console.error("Error adding review:", error);
  //   }
  // };

  return (
    <div className="flex flex-col max-w-6xl text-center items-center justify-center w-full mx-auto mt-3 gap-y-4">
      <div className="relative w-full flex items-center text-4xl font-lora text-white underline">
        <div className="w-8" />
        <div className="flex items-center mx-auto space-x-2">
          <FontAwesomeIcon icon={faMountainSun} className="text-white" />
          <span>{peak.name}</span>
        </div>
      </div>
      <div className="flex flex-row items-start justify-start w-full max-w-6xl p-4">
        <div className="flex flex-col items-start justify-start mb-4 w-1/2">
          <div className="w-full mb-6 bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <h3 className="text-xl font-lora text-white mb-3 border-b border-white/20 pb-2">
              Informacje o szczycie
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-white/70 font-medium w-20">Region:</span>
                <span className="text-white font-lora ml-2">{peak.region}</span>
              </div>
              <div className="flex items-center">
                <span className="text-white/70 font-medium w-20">
                  Wysokość:
                </span>
                <span className="text-yellow-400 font-lora ml-2 font-semibold">
                  {peak.elevation} m n.p.m.
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-white/70 font-medium w-20">Status:</span>
                {isCrownPeak && (
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      peak.verified
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                    }`}
                  >
                    {peak.verified ? "Zweryfikowany" : "Niezweryfikowany"}
                  </span>
                )}
                {isMyPeak && (
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30
                  `}
                  >
                    {"Zdobyty"}
                  </span>
                )}
              </div>
              {isCrownPeak && verificationResult && verificationResult.distance && (
                <div className="flex items-center">
                  <span className="text-white/70 font-medium w-20">Odległość:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    verificationResult.isValid 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {verificationResult.distance}m od szczytu
                  </span>
                </div>
              )}
              {isMyPeak && (
                <div className="flex items-center">
                  <span className="text-white/70 font-medium w-20">Data:</span>
                  <span className="text-white font-lora ml-2">
                    {myPeak?.visitedAt
                      ? formatDate(myPeak.visitedAt)
                      : "Nieznana"}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <h3 className="text-xl font-lora text-white mb-3">Lokalizacja</h3>
            <div className="w-full h-64 rounded-lg overflow-hidden border border-white/20 shadow-lg">
              <MapTrails hoverPoint={[peak.latitude, peak.longitude]} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-start w-1/2 ml-4">
          {isCrownPeak && (
            <div className="w-full mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="block w-full h-64 border-2 border-dashed border-white/40 rounded-lg cursor-pointer hover:border-white/60 transition-colors"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white/60 backdrop-blur-lg">
                    <span className="text-lg font-lora mb-2">
                      Dodaj zdjęcie szczytu
                    </span>
                    <span className="text-sm">Kliknij aby wybrać plik</span>
                  </div>
                )}
              </label>
            </div>
          )}
          {isMyPeak && (
            <div className="w-full mb-4">
              <h3 className="text-xl font-lora text-white mb-3 border-b border-white/20 pb-2 mt-4">
                Moje zdjęcie
              </h3>
              <div className="grid grid-cols-1 max-h-1/2  gap-3 mt-4">
                {myPeak?.photoUrl && (
                  <div className=" rounded-lg overflow-hidden border border-white/30">
                    <img
                      src={
                        userImagePreview ||
                        filesService.getPeakImgUrl(myPeak.photoUrl)
                      }
                      alt="Twoje zdjęcie szczytu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {!myPeak?.photoUrl && (
                  <div className="flex items-center justify-center w-full h-64 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                    <span className="text-white/60">
                      Nie dodano jeszcze zdjęcia
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          {isCrownPeak && (
            <div className="w-full mb-4">
              <label className="block text-lg font-lora text-white mb-2">
                Dodaj Komentarz
              </label>
              <textarea
                className="w-full h-24 p-3 bg-white/20 backdrop-blur-lg shadow-lg text-white rounded-lg placeholder-white/60 border border-white/20 focus:border-white/40 outline-none"
                placeholder="Podziel się swoimi wrażeniami ze szczytu..."
              />
            </div>
          )}
          {isMyPeak && (
            <div className="w-full mb-4">
              <label className="block text-lg font-lora text-white mb-2">
                Mój opis
              </label>
              <textarea
                readOnly
                value={myPeak?.description || ""}
                className="w-full h-24 p-3 bg-white/20 backdrop-blur-lg shadow-lg text-white rounded-lg placeholder-white/60 border border-white/20 focus:border-white/40 outline-none"
                placeholder="Podziel się swoimi wrażeniami ze szczytu..."
              />
            </div>
          )}
          {isCrownPeak && (
            <div className="w-full">
              <label className="block text-lg font-lora text-white mb-2">
                Oceń szczyt:
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className={`text-2xl cursor-pointer transition-colors ${
                      star <= (hoveredStar || rating)
                        ? "text-yellow-400 "
                        : "text-white/30"
                    } hover:text-yellow-300  `}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                  />
                ))}
                <span className="ml-2 text-white font-lora">
                  {rating > 0 ? `${rating}/5` : "Nie oceniono"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCrownPage;
