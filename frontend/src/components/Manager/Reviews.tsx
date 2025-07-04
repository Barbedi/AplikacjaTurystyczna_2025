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
    <div className="w-full h-full flex justify-center items-center">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex flex-row bg-accent/60 rounded-lg shadow-lg p-2 mt-5 justify-center items-center cursor-pointer transition-all duration-300 ease-in-out ${isOpen ? "h-full" : "h-15 w-full"}`}
      >
        {isOpen && (
          <div className="flex flex-row items-start mx-2">
            <img
              className="w-sm h-35 object-cover rounded-lg"
              src="/assets/img/IMG_5962.jpg"
              alt="Trasa"
            />
          </div>
        )}
        <div className="flex flex-col w-full ">
          {isOpen && (
            <div className="flex justify-end items-end">
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="text-white text-2xl cursor-pointer flex"
              />
            </div>
          )}
          {opinias.map((opinia, index) => (
            <div key={index} className="p-4 text-white mb-4">
              <h3 className="text-3xl font-semibold">{opinia.nameRoute}</h3>
              {isOpen && (
                <p className="mt-2 text-md text-start">
                  Data: {new Date(opinia.date).toLocaleDateString()}
                </p>
              )}
              {isOpen && (
                <p className="mt-2 text-md text-start mr-2">
                  Ocena trasy: {opinia.rating}
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className={`ml-1 text-white ${i < opinia.rating ? "text-yellow-500" : "text-gray-400"}`}
                    />
                  ))}
                </p>
              )}
              {isOpen && (
                <p className="mt-2 text-md text-start">Dodany komentarz:</p>
              )}
              {isOpen && (
                <p className="mt-2 text-md text-center">{opinia.comment}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
