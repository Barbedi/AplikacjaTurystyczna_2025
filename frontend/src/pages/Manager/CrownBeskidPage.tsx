import PeakItem from "../../components/Manager/Peaks/PeakItem";
import PeaksService from "../../services/peaks.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMountain } from "@fortawesome/free-solid-svg-icons";

const CrownBeskidPage = () => {
  return (
    <div className="flex flex-col max-w-6xl items-center justify-center w-full mx-auto mt-6 gap-y-6">
      <div className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faMountain} className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Korona Beskidu Sądeckiego
            </h1>
            <p className="text-gray-300 mt-1">
              Twoja wirtualna książeczka górska
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start w-full">
        <PeakItem fetchPeaks={PeaksService.getCrownBeskid} />
      </div>
    </div>
  );
};

export default CrownBeskidPage;
