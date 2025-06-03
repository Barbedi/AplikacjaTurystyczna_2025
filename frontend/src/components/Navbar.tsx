const Navbar = () => {
  return (
    <div>
      {/* Sekcja z tłem */}
      <div className="h-screen bg-[url('/assets/img/FullSizeRender2.JPG')] bg-cover bg-center bg-no-repeat">
        <nav className="bg-nav bg-opacity-70 font-lora p-4">
          <div className="flex">
            <a href="/" className="pl-4">
              <span className="font-bold text-4xl">HikeUp</span>
            </a>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center bg-white/60 max-w-2/3 mx-auto max-h-2/4 rounded-lg shadow-lg mt-20 p-8">
          <div className="text-black text-center flex flex-col items-center">
            <h1 className="text-6xl font-lora">Wędrówka marzeń?</h1>
            <p className="text-6xl font-lora">Znajdziesz ją z HikeUp!</p>
          </div>

          <div className="mt-8 flex flex-col items-center w-full">
            <div className="mb-4 w-full flex justify-center">
              <input
                type="text"
                placeholder="Wyszukaj szlaku"
                className="w-2/4 p-2 border border-gray-300 rounded-2xl"
              />
            </div>
            <div className="mb-4">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                Szukaj
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
