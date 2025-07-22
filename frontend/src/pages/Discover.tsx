import DiscoverList from "../components/DiscoverList";
import Navbar from "../components/Navbar";
const Discover = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-grad1 to-grad2 pb-24 md:pb-4">
      <Navbar />
      <div className="flex flex-col max-w-6xl text-center items-center justify-center w-full mx-auto mt-3 gap-y-1 ">
        <div className="flex flex-row items-start justify-start w-full mx-4 p-3 border-b-2 border-white">
          <span className="flex-1 text-xl font-lora text-white">Nazwa Trasy</span>
          <span className="flex-1 text-xl font-lora text-white">Region</span>
          <span className="flex-1 text-xl font-lora text-white">
            Długość trasy
          </span>
          <span className="flex-1 text-xl font-lora text-white">Akcja</span>
        </div>
        <div className="flex flex-col items-start justify-start w-full">
          <DiscoverList />
        </div>
      </div>
    </div>
  );
};

export default Discover;
