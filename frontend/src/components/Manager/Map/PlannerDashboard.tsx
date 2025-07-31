import { useState, useEffect, useContext, useMemo, useCallback } from "react";
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
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { RouteTrail, RoutePoint, Trails } from "../../../assets/Data";
import ElevationProfile from "../ElevationProfile";
import TrailsService from "../../../services/trails.service";
import AuthContext from "../../../store/auth-context";
import useGetUsers from "../../../hooks/user/useGetUser";
import { useNavigate } from "react-router-dom";
import { timeForWalk } from "../../../utils/timeforWalk";
import { calculateElevationGainAndLoss } from "../../../utils/elevation";

interface PlannerDashboardProps {
  visible: boolean;
  points: RoutePoint[];
  route: RouteTrail | null;
  editingTrail?: Trails | null;
  isEditing?: boolean;
  onHoverPoint?: (lat: number, lng: number) => void;
  onRemovePoint?: (index: number) => void;
  onRouteTypeChange?: (type: "one-way" | "loop" | "back-and-forth") => void;
  onTrailUpdated?: (updatedTrail: Trails) => void;
  onCancelEdit?: () => void;
}

const PlannerDashboard: React.FC<PlannerDashboardProps> = ({
  visible,
  points,
  route,
  editingTrail,
  isEditing = false,
  onHoverPoint,
  onRemovePoint,
  onRouteTypeChange,
  onTrailUpdated,
  onCancelEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [routeType, setRouteType] = useState<
    "one-way" | "loop" | "back-and-forth"
  >("one-way");
  const [region, setRegion] = useState<"Tatry" | "Beskid Sądecki">("Tatry");
  const [name, setName] = useState("");
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData } = useGetUsers();
  

  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);

  useEffect(() => {
    if (editingTrail && isEditing) {
      setName(editingTrail.name || "");
      setRouteType(editingTrail.route_type);
      setRegion(editingTrail.region as "Tatry" | "Beskid Sądecki");
    }
  }, [editingTrail, isEditing]);

  const currentUser = usersData?.[0]?.[0];
  console.log("Current user:", currentUser);
  const routeData = useMemo(() => {
   if (!route) return null;

  const feature = route.features?.[0];
  if (!feature || !feature.geometry || !feature.geometry.coordinates) return null;

  const geometry = feature.geometry;
  const details =feature.properties
  let coordinates: number[][];

  if (
    Array.isArray(geometry.coordinates[0]) &&
    Array.isArray(geometry.coordinates[0][0])
  ) {
    coordinates = geometry.coordinates[0] as unknown as number[][];
  } else {
    coordinates = geometry.coordinates as unknown as number[][];
  }

  const elevations = coordinates
    .map((coord) => coord[2])
    .filter((elev) => typeof elev === "number" && !isNaN(elev));

  const elevationGain =
    elevations.length > 0
      ? Math.max(...elevations) - Math.min(...elevations)
      : 0;

  return {
    coordinates,
    elevations,
    elevationGain,
    details,
    

  };
}, [route]);


  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    [],
  );

  const handleRouteTypeChange = useCallback(
    (type: "one-way" | "loop" | "back-and-forth") => {
      setRouteType(type);
      onRouteTypeChange?.(type);
    },
    [onRouteTypeChange],
  );

  const handleRegionChange = useCallback(
    (region: "Tatry" | "Beskid Sądecki") => {
      setRegion(region);
    },
    [],
  );

  const handleHoverPoint = useCallback(
    (hoverLat: number, hoverLng: number) => {
      if (!isNaN(hoverLat) && !isNaN(hoverLng)) {
        onHoverPoint?.(hoverLat, hoverLng);
      } else {
        onHoverPoint?.(NaN, NaN);
      }
    },
    [onHoverPoint],
  );

  const handleSaveTrail = useCallback(async () => {
    if (!routeData) return;

    const trailData = {
      id: editingTrail?.id || 0,
      name: name || "Moja trasa",
      description: editingTrail?.description || "",
      difficulty: editingTrail?.difficulty || "",
      length_km: routeData.details?.distance
        ? Number((routeData.details.distance / 1000).toFixed(2))
        : 0,
      elevation_gain: Math.round(routeData.elevationGain) || 0,
      region: region,
      route_type: routeType,
      geometry: {
        type: "LineString",
        coordinates: routeData.coordinates,
      },
      created_by: currentUser?.id?.toString() || "1",
      duration_minutes: Math.round(0),
    };

    const pointsData = points.map((p, idx) => ({
      coordinates: p.coordinates,
      name: p.name,
      point_order: idx,
    })) as RoutePoint[];

    try {
      let res;
      if (isEditing && editingTrail?.id) {
        res = await TrailsService.updateTrail(editingTrail.id, {
          ...trailData,
          points: pointsData,
        });
        alert("Trasa zaktualizowana pomyślnie!");
        navigate(`/dashboard/my-routes/${editingTrail.id}`);
        console.log("Trail updated:", res.data);

        if (onTrailUpdated && res.data) {
          onTrailUpdated(res.data);
        }
      } else {
        res = await TrailsService.createTrail({
          ...trailData,
          points: pointsData,
        });
        alert("Trasa zapisana pomyślnie!");
        console.log("Trail created:", res.data);
      }
    } catch (err) {
      console.error("Błąd zapisu trasy:", err);
      alert("Wystąpił błąd przy zapisie trasy.");
    }
  }, [
    routeData,
    editingTrail,
    name,
    region,
    routeType,
    currentUser,
    points,
    isEditing,
    onTrailUpdated,
    navigate,
  ]);

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
        <div className="text-gray-800 text-sm">
          <h2 className="text-2xl font-bold mb-4">Opcje trasy</h2>
          <div className="mb-4 w-full flex flex-row items-start justify-between">
            <div className="flex flex-col flex-1">
              <label className="text-lg font-semibold mb-2">Nazwa trasy</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                required
                placeholder="Wprowadź nazwę trasy"
                defaultValue="Moja trasa"
                className="bg-transparent text-gray-700 text-sm outline-none w-1/2"
              />
            </div>

            <FontAwesomeIcon
              icon={isEditing ? faCheck : faHeartCircleCheck}
              className="text-black text-2xl cursor-pointer ml-2"
              onClick={handleSaveTrail}
              title={isEditing ? "Zaktualizuj trasę" : "Zapisz trasę w profilu"}
            />
            {isEditing && (
              <FontAwesomeIcon
                icon={faXmark}
                className="text-black text-2xl cursor-pointer ml-2"
                onClick={onCancelEdit}
                title="Anuluj edycję"
              />
            )}
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
          <ol className="list-decimal pl-5 mb-4 space-y-1 max-h-18 overflow-y-auto pr-2 scrollbar-thin">
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
                      title={
                        point.name
                          ? `Współrzędne: ${lat.toFixed(5)}, ${lng.toFixed(5)}`
                          : undefined
                      }
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
          <div className="flex flex-row space-y-4">
            <div className="mb-4 w-1/2">
              <label className="block text-sm font-medium mb-1">
                Typ trasy
              </label>
              <select
                className="w-full p-2 rounded-md text-sm focus:outline-none"
                value={routeType}
                onChange={(e) =>
                  handleRouteTypeChange(
                    e.target.value as "one-way" | "loop" | "back-and-forth",
                  )
                }
              >
                <option value="one-way">W jedną stronę</option>
                <option disabled value="loop">
                  Pętla
                </option>
                <option value="back-and-forth">W tę i z powrotem</option>
              </select>
            </div>
            <div className="mb-4 w-1/2">
              <label className="block text-sm font-medium mb-1">Region</label>
              <select
                className="w-full p-2 rounded-md text-sm focus:outline-none"
                value={region}
                required
                onChange={(e) =>
                  handleRegionChange(
                    e.target.value as "Tatry" | "Beskid Sądecki",
                  )
                }
              >
                <option value="Tatry">Tatry</option>
                <option value="Beskid Sądecki">Beskid Sądecki</option>
              </select>
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-2">
            <FontAwesomeIcon icon={faList} /> Podsumowanie:
          </h2>
          <div className="flex flex-row space-x-4">
          <div className="mb-4 space-y-1">
            <p>
              <strong>Długość trasy:</strong> {routeData?.details?.distance !== undefined ? (routeData.details.distance / 1000).toFixed(1) : "0.00"} km
            </p>
            <p>
              <strong>Czas przejścia:</strong>{" "}
              {routeData
                ? `${timeForWalk(
                    routeData.details.distance / 1000,
                    routeData.elevationGain,
                  )}`
                : "0 godz."}
            </p>
            </div>
            <div className="mb-4 space-y-1">
            <p>
              <strong>Suma podejść:</strong>{" "}
              {routeData?.elevationGain ? `${(calculateElevationGainAndLoss(routeData.coordinates).gain.toFixed(0))} m` : "0 m"}
            </p>
            <p>
              <strong>Suma zejść:</strong>{" "}
              {routeData?.elevationGain ? `${(calculateElevationGainAndLoss(routeData.coordinates).loss.toFixed(0))} m` : "0 m"}
            </p>
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-2">
            <FontAwesomeIcon icon={faMountain} /> Wykres wysokości
          </h2>
          <div className="mb-4 space-y-1">
            <ElevationProfile route={route} onHoverPoint={handleHoverPoint} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PlannerDashboard;
