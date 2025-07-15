import { useNavigate } from "react-router-dom";

const CrownPeaks = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-[90vh] lg:-mt-7.5 mx-auto gap-12 p-9">
      <div
        onClick={() => navigate("crown-poland")}
        className="bg-white shadow-lg rounded-2xl flex flex-col lg:w-1/3 md:w-1/2 bg-[url('/assets/img/IMG_2341.jpg')] relative bg-cover bg-center bg-no-repeat h-[75vh] hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <div className="absolute top-1/3 left-0 right-0 p-5 m-5 rounded-2xl bg-accent/50 text-center">
          <h2 className="text-white text-4xl font-lora">
            Korona Gór
            <br />
            Polski
          </h2>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-2xl">
          <p className="text-white mt-2 font-lora">
            Korona Gór Polski to 28 szczytów i 16 pasm górskich, które zapierają
            dech w piersiach.
          </p>
        </div>
      </div>
      <div
        onClick={() => navigate("crown-beskid")}
        className="bg-white shadow-lg rounded-2xl flex flex-col w-1/3 bg-[url('/assets/img/IMG_4048.JPG')] relative bg-cover bg-center bg-no-repeat h-[75vh] hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <div className="absolute top-1/3 left-0 right-0 p-5 m-5 rounded-2xl bg-accent/60">
          <h2 className="text-white text-4xl font-lora text-center">
            Korona Beskidu Sądeckiego
          </h2>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-2xl">
          <p className="text-white mt-2 font-lora">
            Odkryj ukryte szlaki i zachwycające widoki Korony Beskidu
            Sądeckiego.
          </p>
        </div>
      </div>
    </div>
  );
};
export default CrownPeaks;
