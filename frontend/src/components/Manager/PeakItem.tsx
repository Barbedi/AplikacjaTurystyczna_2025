import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Peaks } from "../../assets/Data";

interface PeakItemProps {
  fetchPeaks: () => Promise<{ data: { data: Peaks[] } }>;
}

const PeakItem = ({ fetchPeaks }: PeakItemProps) => {
  const [peaks, setPeaks] = useState<Peaks[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPeaks()
      .then((res) => {
        setPeaks(res.data.data);
      })
      .catch((err) => {
        console.error("Błąd pobierania szczytów:", err);
      })
      .finally(() => setLoading(false));
  }, [fetchPeaks]);

  if (loading) {
    return <div className="text-white text-center mt-5">Ładowanie szczytów...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full mt-5 mx-auto">
      {peaks.map((peak) => (
        <div
          key={peak.id}
          className="flex flex-row items-start justify-start w-full m-1 p-5 bg-accent rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
        >
          <span className="flex-1 text-lg font-lora text-white">{peak.name}</span>
          <span className="flex-1 text-lg font-lora text-white">{peak.elevation} m n.p.m.</span>
          <span className="flex-1 text-lg font-lora text-white">{peak.region}</span>
          <span className="flex-1 text-lg font-lora text-white">
            {peak.verified ? (
              <VerifiedIcon className="text-green-500" titleAccess="Zweryfikowane" />
            ) : (
              "Nie"
            )}
          </span>
          <span className="flex-1 text-lg font-lora text-white">
            <FontAwesomeIcon
              icon={faEdit}
              className="text-white cursor-pointer text-lg"
              title="Edytuj"
            />
          </span>
        </div>
      ))}
    </div>
  );
};

export default PeakItem;
