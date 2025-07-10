import PeakItem from "../../components/Manager/PeakItem";
import PeaksService from "../../services/peaks.service";

const CrownPolandPage = () => {
  return (
    <div className="flex flex-col max-w-6xl text-center items-center justify-center w-full mx-auto mt-3 gap-y-4">
      <div className="flex flex-row items-start justify-start w-full mx-4 p-3 border-b-2 border-white">
        <span className="flex-1 text-xl font-lora text-white">Nazwa Szczytu</span>
        <span className="flex-1 text-xl font-lora text-white">Wysokość</span>
        <span className="flex-1 text-xl font-lora text-white">Pasmo</span>
        <span className="flex-1 text-xl font-lora text-white">Zweryfikowane</span>
        <span className="flex-1 text-xl font-lora text-white">Edycja</span>
      </div>
        <div className="flex flex-col items-start justify-start w-full">
            <PeakItem fetchPeaks={PeaksService.getCrownPoland} />
        </div>

    </div>
  );
};

export default CrownPolandPage;
