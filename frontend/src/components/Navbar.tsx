import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const images = [
  "/assets/img/FullSizeRender.JPG",
  "/assets/img/FullSizeRender2.JPG",
  "/assets/img/IMG_4048.JPG",
];

const Navbar = () => {
  const [current, setCurrent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            className="w-full h-screen object-cover flex-shrink-0"
            alt={`Slide ${index}`}
          />
        ))}
      </div>
      <button
        onClick={prev}
        className="absolute z-30 top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full  hover:scale-105 cursor-pointer transition duration-300"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-30 hover:scale-105 cursor-pointer transition duration-300"
      >
        <FontAwesomeIcon icon={faArrowRight} className="text-xl" />
      </button>
      <header className="absolute top-0 left-0 w-full bg-nav bg-opacity-70 font-lora p-4 z-30">
        <div className="flex items-center justify-between">
          <a href="/" className="pl-4 ">
            <span className="font-bold text-white text-4xl">HikeUp</span>
          </a>
          <button
            onClick={toggleMenu}
            className="text-white text-3xl md:hidden pr-4 focus:outline-none"
          >
            ☰
          </button>
          <div
            className={`${
              menuOpen ? "flex" : "hidden"
            } flex-col md:flex md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 pr-4 z-0`}
          >
            <a
              href="/plan-route"
              className="text-white text-xl hover:text-gray-300 transition duration-300 hover:border-2 rounded-2xl p-1"
            >
              Zaplanuj trasę
            </a>
            <a
              href="/login"
              className="text-white text-xl hover:text-gray-300 transition duration-300 hover:border-2 rounded-2xl p-1"
            >
              Zaloguj się
            </a>
          </div>
        </div>
      </header>
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
    </div>
  );
};

export default Navbar;
