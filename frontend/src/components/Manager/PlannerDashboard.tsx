import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faDownload,
  faMountain,
  faList,
  faMapLocationDot,
  faHeartCircleCheck,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { routeTrail, RoutePoint } from "../../assets/Data";
import ElevationProfile from "./ElevationProfile";

interface PlannerDashboardProps {
  visible: boolean;
  points: RoutePoint[];
  route: routeTrail | null;
  onHoverPoint?: (lat: number, lng: number) => void;
  onRemovePoint?: (index: number) => void;
  onRouteTypeChange?: (type: 'one-way' | 'loop' | 'back-and-forth') => void;
}

const PlannerDashboard: React.FC<PlannerDashboardProps> = ({
  visible,
  points,
  route,
  onHoverPoint,
  onRemovePoint,
  onRouteTypeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [routeType, setRouteType] = useState<'one-way' | 'loop' | 'back-and-forth'>('one-way');

  const handleRouteTypeChange = (type: 'one-way' | 'loop' | 'back-and-forth') => {
    setRouteType(type);
    onRouteTypeChange?.(type);
  };

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
        ${isOpen ? "translate-x-0 w-120 p-4" : "translate-x-full w-0 p-0"} overflow-hidden`}
      >
        <div className="p-4 text-gray-800 text-sm">
          <h2 className="text-2xl font-bold mb-4">Opcje trasy</h2>

          <div className="mb-4 w-full flex flex-row items-start justify-between">
            <div className="flex flex-col flex-1">
              <label className="text-lg font-semibold mb-2">Nazwa trasy</label>
              <input
                type="text"
                placeholder="Wprowadź nazwę trasy"
                defaultValue="Moja trasa"
                className="bg-transparent text-gray-700 text-sm outline-none w-1/2"
              />
            </div>

            <FontAwesomeIcon
              icon={faHeartCircleCheck}
              title="Zapisz trasę w profilu"
              className="text-black text-2xl cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faDownload}
              title="Pobierz trasę"
              className="text-black text-2xl cursor-pointer ml-2"
            />
            <FontAwesomeIcon
              icon={faTrash}
              title="Wyczyść trasę"
              className="text-black text-2xl cursor-pointer ml-2"
            />
          </div>

          <h2 className="text-lg font-semibold mb-2">
            <FontAwesomeIcon icon={faMapLocationDot} /> Punkty trasy:
          </h2>
          <ol className="list-decimal pl-5 mb-4 space-y-1">
            {points.map((point, idx) => {
              const [lat, lng] = point.coordinates;
              const displayName = point.name
                ? `${point.name} (${lat.toFixed(5)}, ${lng.toFixed(5)})`
                : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
              return (
                <li key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <input
                      type="text"
                      readOnly
                      value={displayName}
                      className="bg-transparent text-gray-700 text-sm outline-none w-full"
                      title={point.name ? `Współrzędne: ${lat.toFixed(5)}, ${lng.toFixed(5)}` : undefined}
                    />
                  </div>
                  <button
                    className="ml-2 text-red-500 hover:text-red-700 text-sm"
                    onClick={() => onRemovePoint?.(idx)}
                    title="Usuń punkt"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Typ trasy</label>
            <select
              className="w-full p-2 rounded-md text-sm focus:outline-none"
              value={routeType}
              onChange={(e) => handleRouteTypeChange(e.target.value as 'one-way' | 'loop' | 'back-and-forth')}
            >
              <option selected value="one-way">W jedną stronę</option>
              <option disabled value="loop">Pętla</option>
              <option value="back-and-forth">W tę i z powrotem</option>
            </select>
          </div>

          <h2 className="text-lg font-semibold mb-2">
            <FontAwesomeIcon icon={faList} /> Podsumowanie:
          </h2>
          <div className="mb-4 space-y-1">
            <p>
              <strong>Długość trasy:</strong>{" "}
              {route ? (route.features[0].properties.summary.distance / 1000).toFixed(2) : "0"} km
            </p>
            <p>
              <strong>Czas przejścia:</strong>{" "}
              {route
                ? `${Math.floor(route.features[0].properties.summary.duration / 3600)} h ${Math.floor(
                    (route.features[0].properties.summary.duration % 3600) / 60
                  )} min`
                : "0 h 0 min"}
            </p>
            <p>
              <strong>Przewyższenie:</strong>{" "}
              {route
                ? `${
                    Math.max(
                      ...route.features[0].geometry.coordinates
                        .map((c) => c[2])
                        .filter((elev) => typeof elev === "number" && !isNaN(elev))
                    ) -
                    Math.min(
                      ...route.features[0].geometry.coordinates
                        .map((c) => c[2])
                        .filter((elev) => typeof elev === "number" && !isNaN(elev))
                    )
                  } m`
                : "0 m"}
            </p>
          </div>

          <h2 className="text-lg font-semibold mb-2">
            <FontAwesomeIcon icon={faMountain} /> Wykres wysokości
          </h2>
          <div className="mb-4 space-y-1">
            <ElevationProfile
              route={route}
              onHoverPoint={(hoverLat, hoverLng) => {
                if (!isNaN(hoverLat) && !isNaN(hoverLng)) {
                  onHoverPoint?.(hoverLat, hoverLng);
                } else {
                  onHoverPoint?.(NaN, NaN);
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PlannerDashboard;
