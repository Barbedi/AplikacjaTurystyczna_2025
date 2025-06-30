// src/pages/PlanRoute.tsx
import { useContext } from "react";
import AuthContext from "../store/auth-context";

const PlanRoute = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div className="min-h-screen  pb-24 md:pb-0 text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">
        {auth ? "Zaplanuj trasę (Panel użytkownika)" : "Zaplanuj trasę"}
      </h1>

      {/* Wspólna część UI */}
      <div className="mb-6 ">
        <p className="text-lg">
          Wybierz punkty trasy i sposób przemieszczania się.
        </p>
        {/* Możesz tu dodać inputy, mapę itp. */}
      </div>

      {/* Sekcja tylko dla zalogowanych */}
      {auth && (
        <div className="bg-white/10 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Opcje zaawansowane</h2>
          <button className="mt-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700">
            Zapisz trasę do profilu
          </button>
        </div>
      )}

      {/* Sekcja tylko dla niezalogowanych */}
      {!auth && (
        <p className="mt-8 text-sm italic text-gray-300">
          Zaloguj się, aby zapisać trasę i skorzystać z dodatkowych funkcji.
        </p>
      )}
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold mb-4">Planowanie szlaków</h1>
        <p className="text-gray-500 text-lg">
          Ta strona jest jeszcze w budowie. Wkrótce będzie dostępna!
        </p>
      </div>
    </div>
  );
};

export default PlanRoute;
