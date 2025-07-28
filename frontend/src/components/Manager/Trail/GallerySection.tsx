import { useRef, useState } from "react";
import { ExtendedTrail } from "../../../assets/Data";
import filesService from "../../../services/files.service";
import trailsService from "../../../services/trails.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons";

interface GallerySectionProps {
  trail: ExtendedTrail;
  onPhotosUpdated: (updatedTrail: ExtendedTrail) => void;
}

const GallerySection = ({ trail, onPhotosUpdated }: GallerySectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDeletePhoto = async (image_name: string) => {
    try {
      await trailsService.deleteTrailPhoto(trail.id, image_name);
      const updated = await trailsService.getTrailById(trail.id);
      onPhotosUpdated(updated.data);
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !trail.id) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error("Plik jest zbyt duży. Maksymalny rozmiar to 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      const response = await filesService.uploadTrailImage(file);
      const filename = response.data.file?.filename;

      if (!filename) throw new Error("Brak nazwy pliku w odpowiedzi");

      await trailsService.updateTrailPhotos(trail.id, [
        {
          image_name: filename,
          created_at: new Date().toISOString(),
        },
      ]);

      const updated = await trailsService.getTrailById(trail.id);
      onPhotosUpdated(updated.data);
    } catch (err) {
      console.error("Błąd podczas przesyłania pliku:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-lora text-white">Galeria zdjęć</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`${
            isUploading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          } transition-colors text-white font-medium py-2 px-4 rounded-lg flex items-center`}
        >
          {isUploading ? (
            <span>Przesyłanie...</span>
          ) : (
            <>
              <FontAwesomeIcon icon={faImage} className="mr-2" />
              <span>Dodaj zdjęcie</span>
            </>
          )}
        </button>
      </div>

      {trail.photos && trail.photos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trail.photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group overflow-hidden rounded-lg shadow-md"
              >
                <img
                  src={filesService.getTrailImgUrl(photo.image_name)}
                  alt={`Zdjęcie trasy ${trail.name}`}
                  className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 w-full p-3 flex justify-between items-center">
                    <span className="text-white text-sm">
                      {new Date(photo.created_at || "").toLocaleDateString()}
                    </span>
                    <button
                      className="text-white bg-red-600/80 hover:bg-red-700 p-1 rounded-full"
                      onClick={() => handleDeletePhoto(photo.image_name)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-3 border-t border-white/20 flex justify-between items-center">
            <span className="text-sm text-white/50">
              Liczba zdjęć: {trail.photos.length}
            </span>
            <span className="text-xs text-white/50 italic">
              Najedź kursorem, aby zobaczyć opcje
            </span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-white/70 bg-white/5 rounded-lg">
          <FontAwesomeIcon icon={faImage} className="text-4xl mb-4" />
          <p className="text-xl text-white font-medium">
            Brak zdjęć do wyświetlenia
          </p>
          <p className="text-sm text-white/50 mt-2 max-w-md text-center">
            Kliknij przycisk "Dodaj zdjęcie" powyżej, aby dodać pierwsze zdjęcie
            tej trasy.
          </p>
        </div>
      )}
    </div>
  );
};

export default GallerySection;
