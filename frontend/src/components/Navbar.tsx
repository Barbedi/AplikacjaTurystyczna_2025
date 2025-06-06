import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const images = [
  '/assets/img/FullSizeRender.JPG',
  '/assets/img/FullSizeRender2.JPG',
  '/assets/img/IMG_4048.JPG',
];


const Navbar = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);


  useEffect(() => {
  const interval = setInterval(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);



  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src={images[current]}
        className="w-full h-full object-cover transition-all duration-500 ease-in-out z-0"
      />
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === index ? 'bg-white scale-125' : 'bg-gray-300'
              }`}
              aria-current={current === index ? 'true' : 'false'}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      <button
        onClick={prev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 hover:scale-105 cursor-pointer transition duration-300"
       >
        <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
      >
        <FontAwesomeIcon icon={faArrowRight} className="text-xl" />
      </button>
      <header className="absolute top-0 left-0 w-full bg-nav bg-opacity-70 font-lora p-4 z-10">
        <div className="flex items-center justify-between">
          <a href="/" className="pl-4">
            <span className="font-bold text-white text-4xl">HikeUp</span>
          </a>
          <div className="flex items-center space-x-4 pr-4">
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
          <h1 className="text-5xl md:text-6xl font-lora text-black mb-4">Wędrówka marzeń?</h1>
          <p className="text-4xl md:text-5xl font-lora text-black mb-8">Znajdziesz ją z HikeUp!</p>

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
