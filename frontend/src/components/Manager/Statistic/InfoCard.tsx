import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface InfoCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  value: string | number;
  name?: string;
  description?: string;
  unit?: string;
}

const InfoCard = ({
  icon,
  title,
  value,
  name,
  description,
  unit,
}: InfoCardProps) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-full max-w-[32rem] h-36 flex flex-col items-center justify-center bg-white/10 backdrop-blur-lg rounded-lg p-5 shadow-md border-2 border-white/30 overflow-hidden cursor-pointer hover:border-purple-400 hover:shadow-md hover:shadow-purple-400 hover:scale-105 transition-all duration-300"
    >
      <h2
        className={`text-2xl text-white font-serif flex items-center justify-center  text-center leading-tight transform transition-all duration-500 ${
          hover ? "-translate-y-3 opacity-80" : "translate-y-5 opacity-100"
        }`}
      >
        <span className="inline-flex items-center gap-1">
          <FontAwesomeIcon icon={icon} className="text-xl" />
          <span className="text-balance">{title}</span>
        </span>
      </h2>
      <div
        className={`text-center transform transition-all duration-500 ${
          hover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <div className="flex items-center justify-center flex-col">
          {name && (
            <p className="text-purple-300 text-2xl font-medium">{name}</p>
          )}

          <div className="flex items-baseline gap-1">
            <span
              className={` font-bold ${name ? "text-sm text-white" : "text-2xl text-purple-300"}`}
            >
              {value}
            </span>
            {unit && (
              <span
                className={`text-white/80 ${name ? "text-sm" : "text-2xl "}`}
              >
                {unit}
              </span>
            )}
          </div>
        </div>
        {description && (
          <p className="text-gray-300 text-sm mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
