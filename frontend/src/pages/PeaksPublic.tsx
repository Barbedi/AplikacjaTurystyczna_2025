import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Peaks } from "../assets/Data";
import peaksService from "../services/peaks.service";
import filesService from "../services/files.service";
import MapTrails from "../components/Manager/Map/MapTrails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faMountainSun,faPhotoVideo,faMapLocationDot, faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";

const emptyPeak: Peaks = {
  id: 0,
  name: "",
  elevation: 0,
  region: "",
  latitude: 0,
  longitude: 0,
};

interface PeakPhoto {
  photo_url: string;
  visited_at: string;
  description?: string;
  user_email: string;
}

const EditCrownPage = () => {
    const navigate = useNavigate();
  const [peak, setPeak] = useState<Peaks>(emptyPeak);
  const [peakPhotos, setPeakPhotos] = useState<PeakPhoto[]>([]);

  const { id } = useParams<{ id: string }>();
   const handleBackClick = () => {
    navigate(-1);
  };
  useEffect(() => {
    const fetchPeakPhotos = async () => {
      if (!id) return;

      try {
        console.log("Debug - Fetching photos for peak:", id);
        
        const response = await peaksService.getPeakPhotos(id);
        const photosData = response.data.data || response.data;

        console.log("Debug - Photos response:", photosData);

        setPeakPhotos(photosData);
        
      } catch (error) {
        console.error("Error fetching peak photos:", error);
        setPeakPhotos([]);
      }
    };

    fetchPeakPhotos();
  }, [id]);


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
      } catch (error) {
        console.error("Error fetching peak data:", error);
      }
    };

    fetchPeakData();
  }, [id]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-grad1 to-grad2 pb-24 md:pb-0">
        <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="text-2xl text-white cursor-pointer hover:text-gray-300 absolute top-4 left-4"
                title="Wróć do poprzedniej strony"
                onClick={handleBackClick}
              />
      <div className="flex flex-col max-w-6xl text-center items-center justify-center w-full mx-auto gap-y-4">
        <div className="relative w-full flex items-center text-4xl font-lora text-white underline">
          <div className="w-8" />
          <div className="flex items-center mx-auto space-x-2 mt-5">
            <FontAwesomeIcon icon={faMountainSun} className="text-white" />
            <span>{peak.name}</span>
          </div>
        </div>
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
          <h3 className="text-xl font-lora text-white mb-3 border-b border-white/20 pb-2">
            Informacje o szczycie
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70 font-medium">Region:</span>
              <span className="text-white font-lora">{peak.region}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70 font-medium">Wysokość:</span>
              <span className="text-yellow-400 font-lora font-semibold">
                {peak.elevation} m n.p.m.
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70 font-medium">Status:</span>
              <span className="text-blue-400 font-lora">
                Publiczny szczyt
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-start justify-start w-full max-w-6xl p-4 gap-4">
          <div className="w-1/2">
            <h3 className="text-xl font-lora text-white mb-3">
                <FontAwesomeIcon icon={faMapLocationDot} className="mr-2" />
                Lokalizacja</h3>
            <div className="w-full h-96 rounded-lg overflow-hidden border border-white/20 shadow-lg">
              <MapTrails hoverPoint={[peak.latitude, peak.longitude]} />
            </div>
          </div>

          {/* Photos section */}
          <div className="w-1/2">
            <h3 className="text-xl font-lora text-white mb-3">
                <FontAwesomeIcon icon={faPhotoVideo} className="mr-2" />
                Zdjęcia szczytu</h3>
            <div className=" h-96  bg-white/5 backdrop-blur-lg rounded-lg border border-white/20 ">
              {peakPhotos.length > 0 ? (
                peakPhotos.map((photo, index) => (
                  <div key={index} className="group relative rounded-lg overflow-hidden border border-white/30 bg-white/10 backdrop-blur-lg">
                    <img
                      src={filesService.getPeakImgUrl(photo.photo_url)}
                      alt={`Zdjęcie szczytu ${peak.name}`}
                      className="w-full h-95 object-cover"
                      onLoad={() => console.log("Debug - Image loaded successfully")}
                      onError={(e) => {
                        console.error("Debug - Image failed to load:", {
                          src: e.currentTarget.src,
                          photoUrl: photo.photo_url,
                          generatedUrl: filesService.getPeakImgUrl(photo.photo_url)
                        });
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 w-full p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm">
                            {new Date(photo.visited_at).toLocaleDateString()}
                          </span>
                          <div className="text-xs text-gray-400">
                            {photo.user_email}
                          </div>
                        </div>
                        {photo.description && (
                          <div className="text-white/90 text-sm mt-1">
                            {photo.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                  <span className="text-white/60">
                    Brak zdjęć dla tego szczytu
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCrownPage;
