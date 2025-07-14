import React from "react";
import { CircleMarker, Popup } from "react-leaflet";
import { Shelters, RoutePoint } from "../../assets/Data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseFlag, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface SheltersMapProps {
  shelters: Shelters[];
  addPointAtStart: (point: RoutePoint) => void;
  addPointAtEnd: (point: RoutePoint) => void;
  addPointM: (point: RoutePoint) => void;
}

const SheltersMap: React.FC<SheltersMapProps> = ({
  shelters,
  addPointAtStart,
  addPointAtEnd,
  addPointM,
}) => {
  return (
    <>
      {shelters.map((shelter) => (
        <CircleMarker
          key={shelter.id}
          center={[shelter.latitude, shelter.longitude]}
          radius={6}
          pathOptions={{
            color: "white",
            weight: 1,
            fillColor: "white",
            fillOpacity: 1,
          }}
        >
          <Popup>
            <span className="text-center justify-center items-center flex text-gray-400">
              {shelter.latitude?.toFixed(5)} {shelter.longitude?.toFixed(5)}
            </span>
            <strong className="text-lg underline underline-offset-4 text-center w-full inline-flex justify-center items-center gap-1">
              <FontAwesomeIcon icon={faHouseFlag} className="mb-0.5" />
              {shelter.name}
            </strong>
            <div className="flex flex-col gap-1 ">
              <span className="text-md">
                Wysokość: {shelter.altitude} m n.p.m.
              </span>
              <span className="text-md">Pasmo: {shelter.mountain_range}</span>
              <span className="text-md border-b-2 border-accent">
                Opis: {shelter.description || "Brak opisu"}
              </span>
            </div>
            <div className="flex flex-col gap-2 mt-2 ">
              <button
                type="button"
                onClick={() =>
                  addPointAtStart({
                    coordinates: [shelter.latitude, shelter.longitude],
                    name: shelter.name,
                    type: "shelter",
                  })
                }
                className=" text-black rounded-md transition cursor-pointer w-full text-start p-0.5"
              >
                Ustaw jako początek trasy
                <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
              </button>
              <button
                type="button"
                onClick={() =>
                  addPointM({
                    coordinates: [shelter.latitude, shelter.longitude],
                    name: shelter.name,
                    type: "shelter",
                  })
                }
                className=" text-black rounded-md transition cursor-pointer w-full text-start p-0.5"
              >
                Ustaw punkt pośredni trasy
                <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
              </button>
              <button
                onClick={() =>
                  addPointAtEnd({
                    coordinates: [shelter.latitude, shelter.longitude],
                    name: shelter.name,
                    type: "shelter",
                  })
                }
                type="button"
                className="text-black rounded-md transition cursor-pointer w-full text-start  p-0.5"
              >
                Ustaw jako koniec trasy
                <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
              </button>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
};

export default SheltersMap;
