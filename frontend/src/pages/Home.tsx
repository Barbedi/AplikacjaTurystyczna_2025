import Navbar from "../components/Navbar";
import PlanRoute from "../components/PlanRoute";
import ProposedRoutes from "../components/ProposedRoutes";
import ExploreRoutes from "../components/ExploreRoutes";

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-grad1 to-grad2 pb-24 md:pb-0">
      <Navbar />
      
      <main className="absolute inset-0 flex items-center justify-center z-10 p-4">
        <div className="bg-white/60 rounded-lg shadow-lg p-8 max-w-2xl w-full text-center">
          <h1 className="text-5xl md:text-6xl font-lora text-black mb-4">
            Wędrówka marzeń?
          </h1>
          <p className="text-4xl md:text-5xl font-lora text-black mb-8">
            Znajdziesz ją z HikeUp!
          </p>

          <div className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Wyszukaj szlaku"
              className="w-full md:w-2/3 p-2 border-2 border-black rounded-2xl hover:border-blue-500 focus:outline-none focus:border-blue-500 transition duration-300 text-lg font-lora text-black mb-4"
            />
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
              Szukaj
            </button>
          </div>
        </div>
      </main>
      <PlanRoute />
      <ProposedRoutes />
      <ExploreRoutes />
    </div>
  );
};
export default Home;
