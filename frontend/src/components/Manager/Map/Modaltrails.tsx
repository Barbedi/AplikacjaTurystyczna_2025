import React, { useState, useEffect } from "react";
import Modal from "../../Modal";
import { formatDuration } from "../../../utils/timeforWalk";
import { calculateDifficulty, getDifficultyColor } from "../../../utils/calculateDifficulty";

interface ModaltrailsProps {
  isOpenModal: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
  distance: number;
  elevationGain: number;
  duration: number;
  coordinates?: number[][];
  features?: { id: number; name: string; weight: number }[];
  onSaveDifficulty: (difficulty: string, selectedFeatures: number[]) => void;
}

const Modaltrails: React.FC<ModaltrailsProps> = ({
  isOpenModal,
  setIsOpenModal,
  distance,
  elevationGain,
  duration,
  features: externalFeatures = [], 
  onSaveDifficulty,
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [localFeatures, setLocalFeatures] = useState<
    { id: number; name: string; weight: number }[]
  >([]);

  useEffect(() => {
    if (isOpenModal) {
      setLocalFeatures(externalFeatures);
      setSelectedFeatures([]);
    }
  }, [isOpenModal, externalFeatures]);

  if (!isOpenModal) return null;

  const toggleFeature = (id: number) => {
  setSelectedFeatures((prev) =>
    prev.includes(id)
      ? prev.filter(fId => fId !== id)
      : [...prev, id]
  );
};

  const getDifficulty = () => {
    return calculateDifficulty(
      distance,
      elevationGain,
      duration,
      selectedFeatures,
      localFeatures
    );
  };
  const difficulty = getDifficulty();
  const difficultyColor = getDifficultyColor(difficulty);
  return (
    <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
      <h2 className="text-black text-2xl font-semibold text-center">
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
            <p className="text-2xl font-bold text-black">
              {formatDuration(duration)}
            </p>
            <p className="text-sm text-gray-600">Czas</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-black mb-3">Poziom trudności:</p>
        <span
          className={`inline-block px-4 py-2 rounded-full border font-semibold ${difficultyColor}`}
        >
          {difficulty}
        </span>
        {selectedFeatures.length === 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Wybierz cechy techniczne aby uzyskać dokładniejszą ocenę
            <br />
            Jeśli nie zaznaczysz żadnej cechy, poziom trudności będzie oparty tylko na dystansie i przewyższeniu.
          </p>
        )}
      </div>

      <div className="mb-6 mt-4">
        <label className="text-black mb-3 font-medium block">
          Kliknij, aby zaznaczyć cechy trasy:
        </label>
        <div className="flex flex-wrap gap-2">
          {localFeatures.map((feature) => (
            <button
              key={feature.id}
              onClick={() => toggleFeature(feature.id)}
              className={`px-3 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                selectedFeatures.includes(feature.id)
                  ? "bg-blue-500/20 text-blue-800 border-blue-500/50 shadow-sm"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {selectedFeatures.includes(feature.id) && "✓ "}
              {feature.name}
            </button>
          ))}
        </div>
        {selectedFeatures.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            Wybrane: {selectedFeatures.length} z {localFeatures.length}
          </p>
        )}
      </div>

      <div className="flex flex-row items-end gap-3 mt-6">
        <button
          onClick={() => setIsOpenModal(false)}
          className="cursor-pointer w-full px-4 py-2 rounded-lg bg-black/10 text-black hover:bg-black/20 transition-all"
        >
          Anuluj
        </button>
        <button
          onClick={() => {
             onSaveDifficulty(difficulty, selectedFeatures);
            setIsOpenModal(false);
          }}
          className="cursor-pointer w-full px-4 py-2 rounded-lg bg-green-500/20 text-green-800 hover:bg-green-500/30 border border-green-500/20 transition-all"
        >
          Zapisz
        </button>
      </div>
    </Modal>
  );
};

export default Modaltrails;
