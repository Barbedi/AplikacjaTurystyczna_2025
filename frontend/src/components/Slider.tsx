import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const images = [
  "/assets/img/FullSizeRender.JPG",
  "/assets/img/FullSizeRender2.JPG",
  "/assets/img/IMG_4048.JPG",
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(next, 5000);
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
            alt={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute z-30 top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:scale-105 transition duration-300"
        aria-label="Poprzedni slajd"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
      </button>
      <button
        onClick={next}
        className="absolute z-30 top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:scale-105 transition duration-300"
        aria-label="Następny slajd"
      >
        <FontAwesomeIcon icon={faArrowRight} className="text-xl" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Przejdź do slajdu ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
