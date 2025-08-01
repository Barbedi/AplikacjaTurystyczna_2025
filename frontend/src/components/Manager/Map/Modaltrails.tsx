import React from "react";
import Modal from "../../Modal";
import { useState } from "react";
import { formatDuration } from "../../../utils/timeforWalk";

const trailFeaturesList:Record<string, number> = {
  "Drabinki": 3,
  "Łacuchy": 2,
  "Spadające kamienie": 1,
  "Duża ekspozycja": 3,
  "Ekspozycja": 2,
  "Słabo oznakowany szlak": 1,
  "Trudny teren": 2,
};

interface ModaltrailsProps {
  isOpenModal: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
  distance: number;
  elevationGain: number; 
  duration:  number;
  coordinates?: number[][]; // dodane dla obliczania rzeczywistych podejść/zejść
}

const Modaltrails: React.FC<ModaltrailsProps> = ({
  isOpenModal,
  setIsOpenModal,
  distance,
  elevationGain,
  duration,
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  if (!isOpenModal) return null;

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

 const calculateDifficulty = () => {
  let score = 0;
  const elevation = elevationGain;
  const time = duration; 

 
  if (distance > 20) score += 3;
  else if (distance > 15) score += 2;
  else if (distance > 10) score += 1;

  if (elevation > 1500) score += 3;
  else if (elevation > 1000) score += 2;
  else if (elevation > 500) score += 1;

  if (time > 8) score += 2;
  else if (time > 5) score += 1;

  for (const feature of selectedFeatures) {
    score += trailFeaturesList[feature] || 1;
  }

  if (score >= 10) return "Bardzo trudna";
  if (score >= 7) return "Trudna";
  if (score >= 4) return "Średnia";
  if (score >= 2) return "Łatwa";
  return "Bardzo łatwa";
};

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Bardzo trudna": return "bg-red-500/20 text-red-800 border-red-500/30";
      case "Trudna": return "bg-orange-500/20 text-orange-800 border-orange-500/30";
      case "Średnia": return "bg-yellow-500/20 text-yellow-800 border-yellow-500/30";
      case "Łatwa": return "bg-green-500/20 text-green-800 border-green-500/30";
      case "Bardzo łatwa": return "bg-blue-500/20 text-blue-800 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-800 border-gray-500/30";
    }
  };

  const difficulty = calculateDifficulty();

  return (
    <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
      <h2 className="text-black text-2xl font-semibold  text-center">
        Ustal poziom trudności
      </h2>
      <div className="bg-transparent rounded-lg p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-black">{distance}</p>
            <p className="text-sm text-gray-600">Dystans</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-black">{elevationGain}</p>
            <p className="text-sm text-gray-600">Przewyższenie</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-black">{formatDuration(duration)}</p>
            <p className="text-sm text-gray-600">Czas</p>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-black mb-3">
          {selectedFeatures.length > 0 
            ? "Poziom trudności:" 
            : "Poziom trudności:"
          }
        </p>
        <span className={`inline-block px-4 py-2 rounded-full border font-semibold ${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </span>
        {selectedFeatures.length === 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Wybierz cechy techniczne aby uzyskać dokładniejszą ocenę
            <br />
            jeśli nie zaznaczysz żadnej cechy, poziom trudności będzie oparty tylko na dystansie i przewyższeniu.
          </p>
        )}
      </div>
      <div className="mb-6">
        <label className="text-black mb-3 font-medium block">
         Kliknij, aby zaznaczyć cechy trasy.
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(trailFeaturesList).map((feature) => (
            <button
              key={feature}
              onClick={() => toggleFeature(feature)}
              className={`px-3 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                selectedFeatures.includes(feature)
                  ? "bg-blue-500/20 text-blue-800 border-blue-500/50 shadow-sm"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {selectedFeatures.includes(feature) && "✓ "}
              {feature}
            </button>
          ))}
        </div>
        {selectedFeatures.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Wybrane: {selectedFeatures.length} z {trailFeaturesList.length}
          </p>
        )}
      </div>
      <div className="flex flex-row items-end gap-3 mt-6">
        <button
          onClick={() => setIsOpenModal(false)}
          className="w-full px-4 py-2 rounded-lg bg-black/10 text-black hover:bg-black/20 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          Anuluj
        </button>
        <button
          onClick={() => {
            console.log("Wybrane cechy trasy:", selectedFeatures);
            console.log("Poziom trudności:", difficulty);
            setIsOpenModal(false);
          }}
          className="w-full px-4 py-2 rounded-lg bg-green-500/20 text-green-800 hover:bg-green-500/30 border border-green-500/20 transition-all cursor-pointer"
        >
          Zapisz 
        </button>
      </div>
    </Modal>
  );
};

export default Modaltrails;