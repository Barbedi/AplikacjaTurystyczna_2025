import MyPeaksAdd from "../../components/Manager/Peaks/MyPeaksAdd";
import MyPeaksUser from "../../components/Manager/Peaks/MyPeaksUser";

const MyPeaks = () => {
  return (
    <div className="text-center mt-5 mx-4 flex flex-col items-center justify-center">
      <MyPeaksAdd />
      <div className="w-full mt-3">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-2xl font-lora text-white">Moje Szczyty</h1>
        </div>
        <div >
          <MyPeaksUser />
        </div>
      </div>
    </div>
  );
};
export default MyPeaks;
