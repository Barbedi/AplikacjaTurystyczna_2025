import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Peaks } from "../../assets/Data";
import peaksService from "../../services/peaks.service";
import filesService from "../../services/files.service";
import MapTrails from "../../components/Manager/MapTrails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar,faMountainSun } from "@fortawesome/free-solid-svg-icons";

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
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { id } = useParams<{ id: string }>();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const response = await filesService.uploadPeakImage(file);
        const filename = response.data.file?.filename;
        
        if (filename && id) {
          await peaksService.updateImage(id, filename);
          
          const peakResponse = await peaksService.getById(id);
          setPeak(peakResponse.data.data);
        }
      } catch (error) {
        console.error("Błąd podczas uploadowania zdjęcia:", error);
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
    if (!id) {
      console.error("ID is not provided");
      return;
    }

    peaksService
      .getById(id)
      .then((response) => {
        const peakData = response.data.data;
        setPeak(peakData);
        if (peakData.image_filename) {
          const imageUrl = filesService.getPeakImgUrl(peakData.image_filename);
          setImagePreview(imageUrl);
        }
      })
      .catch((error) => {
        console.error("Error fetching peak data:", error);
      });
  }, [id]);

  return (
    <div className="flex flex-col max-w-6xl text-center items-center justify-center w-full mx-auto mt-3 gap-y-4">
      <div className="text-4xl font-lora text-white mb-4 underline"><FontAwesomeIcon icon={faMountainSun} className="mr-2"/>{peak.name}</div>
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
                <span className="text-white/70 font-medium w-20">Wysokość:</span>
                <span className="text-yellow-400 font-lora ml-2 font-semibold">
                  {peak.elevation} m n.p.m.
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-white/70 font-medium w-20">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  peak.verified 
                    ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                    : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                }`}>
                  {peak.verified ? "Zweryfikowany" : "Niezweryfikowany"}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full">
            <h3 className="text-xl font-lora text-white mb-3">Lokalizacja</h3>
            <div className="w-full h-64 rounded-lg overflow-hidden border border-white/20 shadow-lg">
              <MapTrails
                hoverPoint={[peak.latitude, peak.longitude]}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-start w-1/2 ml-4">
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
                  <span className="text-lg font-lora mb-2">Dodaj zdjęcie szczytu</span>
                  <span className="text-sm">Kliknij aby wybrać plik</span>
                </div>
              )}
            </label>
          </div>
          <div className="w-full mb-4">
            <label className="block text-lg font-lora text-white mb-2">
              Dodaj Komentarz
            </label>
            <textarea
              className="w-full h-24 p-3 bg-white/20 backdrop-blur-lg shadow-lg text-white rounded-lg placeholder-white/60 border border-white/20 focus:border-white/40 outline-none"
              placeholder="Podziel się swoimi wrażeniami ze szczytu..."
            />
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default EditCrownPage;
