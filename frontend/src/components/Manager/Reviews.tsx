import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const opinias = [
  {
    nameRoute: "Hala Ornak – Starorobociański Wierch",
    rating: 4,
    comment: "Świetna trasa, piękne widoki!",
    date: "2023-10-01",
  },
];

const Reviews = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex ${isOpen ? "flex-col" : "flex-row"} bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-4 mt-5 cursor-pointer transition-all duration-300 ease-in-out border border-white/20 hover:bg-white/15 w-full`}
      >
        <div
          className={`flex ${isOpen ? "flex-row w-full" : "flex-col w-full"}`}
        >
          {opinias.map((opinia, index) => (
            <div key={index} className="text-white w-full">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-lora text-white font-semibold">
                  {opinia.nameRoute}
                </h3>
                {isOpen && (
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="text-white/70 hover:text-white text-xl cursor-pointer transition-colors"
                  />
                )}
              </div>

              {!isOpen && (
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          className={`text-xs ${i < opinia.rating ? "text-yellow-400" : "text-white/30"}`}
                        />
                      ))}
                    </div>
                    <span className="text-white/70 text-sm">
                      {opinia.rating}/5
                    </span>
                  </div>
                  <span className="text-white/60 text-sm">
                    Kliknij aby rozwinąć
                  </span>
                </div>
              )}

              {isOpen && (
                <div className="flex gap-6 mt-4 w-full">
                  <div className="flex-shrink-0">
                    <img
                      className="w-40 h-40 object-cover rounded-lg border border-white/20"
                      src="/assets/img/IMG_5962.jpg"
                      alt="Trasa"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-white/70">
                      <span className="font-medium">Data:</span>{" "}
                      {new Date(opinia.date).toLocaleDateString("pl-PL")}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/70 font-medium">
                        Ocena trasy:
                      </span>
                      <span className="text-white font-medium">
                        {opinia.rating}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className={`text-sm ${i < opinia.rating ? "text-yellow-400" : "text-white/30"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-white/70 font-medium mb-2">
                        Komentarz:
                      </p>
                      <p className="text-white p-4  leading-relaxed">
                        {opinia.comment}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
