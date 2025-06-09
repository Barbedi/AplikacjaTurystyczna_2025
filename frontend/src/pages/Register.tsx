import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[url('/assets/img/FullSizeRender.JPG')] bg-cover bg-center ">
      <a
        href="/"
        className="absolute top-4 left-4 text-black text-lg flex items-center hover:underline z-20 "
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Powrót do strony głównej
      </a>
      <main className="absolute inset-0 flex items-center justify-center z-10 p-4">
        <div className="bg-white/60 rounded-lg shadow-lg p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl sm:text-5xl font-lora mb-6 text-gray-800">
            Zarejestruj się w HikeUp
          </h1>
          <form className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Nazwa użytkownika"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Hasło"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Potwierdź hasło"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
              Zarejestruj się
            </button>
            <p className="text-sm text-gray-700">
              Masz już konto?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Zaloguj się
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};
export default Register;
