import React from "react";
import { CircleMarker, Popup } from "react-leaflet";
import { Peaks, RoutePoint } from "../../../assets/Data";

interface PeaksMapProps {
  peaks: Peaks[];
  addPointAtStart: (point: RoutePoint) => void;
  addPointAtEnd: (point: RoutePoint) => void;
  addPointM: (point: RoutePoint) => void;
}

const PeaksMap: React.FC<PeaksMapProps> = ({
  peaks,
  addPointAtStart,
  addPointAtEnd,
  addPointM,
}) => {
  return (
    <>
      {peaks.map((peak) => (
        <CircleMarker
          key={peak.id}
          center={[peak.latitude, peak.longitude]}
          radius={4}
          pathOptions={{
            color: "black",
            weight: 0.5,
            fillColor: "black",
            fillOpacity: 0.7,
          }}
        >
          <Popup>
            <span className="text-center justify-center items-center flex text-gray-400">
              {peak.latitude?.toFixed(5)} {peak.longitude?.toFixed(5)}
            </span>
            <strong className="text-lg underline underline-offset-4 text-center w-full inline-flex justify-center items-center gap-1">
              {peak.name}
            </strong>
            <div className="flex flex-col gap-1 ">
              <span className="text-md">
                Wysokość: {peak.elevation} m n.p.m.
              </span>
            </div>
            <div className="flex flex-col gap-2 mt-2 ">
              <button
                type="button"
                onClick={() =>
                  addPointAtStart({
                    coordinates: [peak.latitude, peak.longitude],
                    name: peak.name,
                    type: "peak",
                    id: peak.id,
                  })
                }
                className=" text-black rounded-md transition cursor-pointer w-full text-start p-0.5 hover:bg-gray-100"
              >
                Ustaw jako początek trasy
              </button>
              <button
                type="button"
                onClick={() =>
                  addPointM({
                    coordinates: [peak.latitude, peak.longitude],
                    name: peak.name,
                    type: "peak",
                    id: peak.id,
                  })
                }
                className=" text-black rounded-md transition cursor-pointer w-full text-start p-0.5 hover:bg-gray-100"
              >
                Ustaw punkt pośredni trasy
              </button>
              <button
                type="button"
                onClick={() =>
                  addPointAtEnd({
                    coordinates: [peak.latitude, peak.longitude],
                    name: peak.name,
                    type: "peak",
                    id: peak.id,
                  })
                }
                className=" text-black rounded-md transition cursor-pointer w-full text-start p-0.5 hover:bg-gray-100"
              >
                Ustaw jako koniec trasy
              </button>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
};

export default PeaksMap;
