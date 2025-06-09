const PlanRoute = () => {
  return (
    <div className="w-full flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center justify-center w-full max-w-screen-xl bg-secondary mx-4 my-10 py-8 px-6 rounded-3xl">
        <div className="flex flex-col items-center justify-center mt-4">
          <span className="text-4xl sm:text-5xl text-white font-lora">
            Zaplanuj trasę
          </span>
        </div>

        <div className="flex flex-row mt-8">
          <div className="flex flex-row lg:flex-nowrap flex-wrap justify-center gap-6 mt-6">
            <div className="flex flex-col w-full sm:w-1/2 xl:w-1/4 h-auto bg-white rounded-xl p-6 mx-2 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg">
              <div className="flex flex-col items-center text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-lora">
                  1
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-lora">
                  Wybierz punkt startowy
                </h2>
                <span className="text-base sm:text-lg md:text-xl font-lora">
                  Kliknij na mapie miejsce lub wpisz miejsce, z którego chcesz
                  wyruszyć.
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full sm:w-1/2 xl:w-1/4 h-auto bg-white rounded-xl p-6 mx-2 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg">
              <div className="flex flex-col items-center text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-lora">
                  2
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-lora">
                  Dodaj punkt docelowy
                </h2>
                <span className="text-base sm:text-lg md:text-xl font-lora">
                  Wybierz miejsce, do którego chcesz dojść.
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full sm:w-1/2 xl:w-1/4 h-auto bg-white rounded-xl p-6 mx-2 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg">
              <div className="flex flex-col items-center text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-lora">
                  3
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-lora">
                  Dodaj punkty pośrednie (opcjonalnie)
                </h2>
                <span className="text-base sm:text-lg md:text-xl font-lora">
                  Jeśli chcesz, dodaj przystanki lub ciekawe miejsca po drodze.
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full sm:w-1/2 xl:w-1/4 h-auto bg-white rounded-xl p-6 mx-2 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg">
              <div className="flex flex-col items-center text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-lora">
                  4
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-lora">
                  Zatwierdź trasę i zapisz plan
                </h2>
                <span className="text-base sm:text-lg md:text-xl font-lora">
                  Gotowe? Zapisz trasę i ruszaj na wyprawę z HikeUp!
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-10">
          <a
            className="bg-white text-black px-6 py-3 text-base sm:text-lg rounded-md hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-lg"
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
