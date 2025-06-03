const Navbar = () => {
  return (
    <div>
      <div className="h-screen bg-[url('/assets/img/FullSizeRender2.JPG')] bg-cover bg-center bg-no-repeat">
        <nav className="bg-nav bg-opacity-70 font-lora p-4">
          <div className="flex">
            <a href="/" className="pl-4">
              <span className="font-bold text-white text-4xl">HikeUp</span>
            </a>
            <div className="flex-grow"></div>
            <div className="flex items-center space-x-4 pr-4">
              <a href="/plan-route" className="text-white text-xl hover:text-gray-300 transition duration-300 hover:border-2 rounded-2xl p-1">
                Zaplanuj trase
              </a>
              <a href="/login" className="text-white text-xl hover:text-gray-300 transition duration-300  hover:border-2 rounded-2xl p-1">
                Zaloguj się
              </a>
              </div>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center bg-white/60 md:max-w-2/3 md:mx-auto md:max-h-2/4 lg:max-w-2/4 lg:min-h-3/6 rounded-lg shadow-lg lg:mt-44 md:mt-20 p-8">
          <div className="text-black text-center flex flex-col items-center ">
            <h1 className="text-6xl font-lora">Wędrówka marzeń?</h1>
            <p className="text-6xl font-lora">Znajdziesz ją z HikeUp!</p>
          </div>
          <div className="mt-10 flex flex-col items-center w-full">
            <div className="mb-4 w-full flex justify-center ">
              <input
                type="text"
                placeholder="Wyszukaj szlaku"
                className="w-2/4 p-2 border-2  border-black rounded-2xl hover:border-blue-500 focus:outline-none focus:border-blue-500 transition duration-300 text-lg font-lora text-black"
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
