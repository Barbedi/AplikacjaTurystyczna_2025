import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Peaks } from "../../assets/Data";
import peaksService from "../../services/peaks.service";

const emptyPeak: Peaks = {
  id: 0,
  name: "",
  elevation: 0,
  region: "",
  latitude: 0,
  longitude: 0,
  verified: false,
};

const EditCrownPage = () => {
  const [peak, setPeak] = useState<Peaks>(emptyPeak);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) {
      console.error("ID is not provided");
      return;
    }

    peaksService
      .getById(id)
      .then((response) => {
        setPeak(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching peak data:", error);
      });
  }, [id]);

  return (
    <div className="flex flex-col max-w-6xl text-center items-center justify-center w-full mx-auto mt-3 gap-y-4">
      <h1 className="text-3xl font-bold text-white mb-4">Edycja szczytu</h1>
      {/* testowe nazwa  */}
      <span>
        nazwa szczytu:
        <span className="text-lg font-lora text-white">{peak.name}</span>
      </span>
    </div>
  );
};

export default EditCrownPage;
