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
        <h2 className="text-xl font-bold mb-4">Opcje trasy</h2>
        <button className="flex items-center text-sm hover:text-blue-600 mb-2">
          <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2" />
          Zapisz trasę
        </button>
        <button className="flex items-center text-sm hover:text-blue-600 mb-2">
          <FontAwesomeIcon icon={faDownload} className="mr-2" />
          Pobierz GPX
        </button>
        <button className="flex items-center text-sm hover:text-blue-600">
          <FontAwesomeIcon icon={faChartLine} className="mr-2" />
          Profil wysokości
        </button>
      </div>
    </>
  );
};

export default PlannerDashboard;
