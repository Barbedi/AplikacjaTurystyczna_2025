const PlanRoute = () => {
  return (
    <div className="w-full flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center justify-center w-7/8 min-h-4/6 bg-secondary mx-20 my-15 py-6 px-4 rounded-4xl">
        <div className="flex flex-col items-center justify-center mt-5">
          <span className="text-5xl text-white font-lora">Zaplanuj Trase</span>
        </div>
        <div className="flex flex-row mt-10">
          <div className="flex flex-row lg:flex-nowrap flex-wrap justify-center gap-3 mt-10">
            <div className="flex flex-col w-full sm:w-1/2 lg:w-1/4 h-auto bg-white rounded-2xl p-4 mx-2 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg">
              <div className="flex flex-col items-center text-center space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-lora">
                  1
                </h1>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-lora">
                  Wybierz punkt startowy
                </h2>
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-lora">
                  Kliknij na mapie miejsce lub wpisz miejsce, z którego chcesz
                  wyruszyć.
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full sm:w-1/2 lg:w-1/4 h-auto bg-white rounded-2xl p-4 mx-1 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg">
              <div className="flex flex-col items-center text-center space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-lora">
                  2
                </h1>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-lora">
                  Dodaj punkt docelowy
                </h2>
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-lora">
                  Wybierz miejsce, do którego chcesz dojść.
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full sm:w-1/2 lg:w-1/4 h-auto bg-white rounded-2xl p-4 mx-1 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg">
              <div className="flex flex-col items-center text-center space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-lora">
                  3
                </h1>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-lora">
                  Dodaj punkty pośrednie (opcjonalnie)
                </h2>
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-lora">
                  Jeśli chcesz, dodaj przystanki lub ciekawe miejsca po drodze.
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full sm:w-1/2 lg:w-1/4 h-auto bg-white rounded-2xl p-4 mx-2 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg">
              <div className="flex flex-col items-center text-center space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-lora">
                  4
                </h1>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-lora">
                  Zatwierdź trasę i zapisz plan
                </h2>
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-lora">
                  Gotowe? Zapisz trasę i ruszaj na wyprawę z HikeUp!
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-10">
          <a
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            href="/plan-route"
          >
            Planuj trasę
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlanRoute;
