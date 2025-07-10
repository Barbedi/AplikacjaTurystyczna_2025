import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faMapMarkedAlt,
  faDownload,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

interface PlannerDashboardProps {
  visible: boolean;
}

const PlannerDashboard: React.FC<PlannerDashboardProps> = ({ visible }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!visible) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-accent text-white rounded-l-full w-8 h-20 shadow-md flex items-center justify-center z-[1001] transition-all duration-300"
      >
        <FontAwesomeIcon icon={isOpen ? faChevronRight : faChevronLeft} />
      </button>

      <div
        className={`fixed top-0 right-0 bg-white/20 backdrop-blur-lg shadow-2xl h-screen rounded-l-2xl transition-transform duration-300 ease-in-out z-[1000]
        ${isOpen ? "translate-x-0 w-80 p-4" : "translate-x-full w-0 p-0"} overflow-hidden`}
      >
        <div className="p-4 text-gray-800 text-sm">
          {/* Nagłówek */}
          <h2 className="text-2xl font-bold mb-4">Opcje trasy</h2>

          {/* Sekcja: Punkty trasy */}
          <h2 className="text-lg font-semibold mb-2">Punkty trasy:</h2>
          <ol className="list-decimal pl-5 mb-4 space-y-1">
            <li>
              Punkt początkowy:{" "}
              <input
                type="text"
                value="49.12345, 19.12345"
                readOnly
                className="bg-transparent text-gray-700 text-sm outline-none w-full"
              />
            </li>
            <li>
              Punkt pośredni:{" "}
              <input
                type="text"
                value="49.23456, 19.23456"
                readOnly
                className="bg-transparent text-gray-700 text-sm outline-none w-full"
              />
            </li>
            <li>
              Punkt końcowy:{" "}
              <input
                type="text"
                value="49.34567, 19.34567"
                readOnly
                className="bg-transparent text-gray-700 text-sm outline-none w-full"
              />
            </li>
          </ol>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Typ trasy</label>
            <select className="w-full p-2 rounded-md  text-sm  focus:outline-none ">
              <option selected value="one-way">
                W jedną stronę
              </option>
              <option value="loop">Pętla</option>
              <option value="back-and-forth">W tę i z powrotem</option>
            </select>
          </div>

          <h2 className="text-lg font-semibold mb-2">Podsumowanie:</h2>
          <div className="mb-4 space-y-1">
            <p>
              <strong>Długość trasy:</strong> 7.8 km
            </p>
            <p>
              <strong>Czas przejścia:</strong> 2h 30min
            </p>
            <p>
              <strong>Przewyższenie:</strong> 450 m
            </p>
          </div>

          <h2 className="text-lg font-semibold mb-2">Akcje:</h2>
          <div className="flex flex-col gap-2 mb-4">
            <button className="flex items-center hover:text-blue-600">
              <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2" />
              Zapisz trasę w profilu
            </button>
            <button className="flex items-center hover:text-purple-600">
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Pobierz GPX
            </button>
            <button className="flex items-center hover:text-green-600">
              <FontAwesomeIcon icon={faChartLine} className="mr-2" />
              Pokaż profil wysokości
            </button>
          </div>

          {/* Sekcja: Inne */}
          <button className="text-red-500 hover:underline text-sm mt-2">
            Wyczyść trasę
          </button>
        </div>
      </div>
    </>
  );
};

export default PlannerDashboard;
