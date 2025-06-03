import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons/faChartSimple";
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile";
import { faGamepad } from "@fortawesome/free-solid-svg-icons/faGamepad";

const Navbar = () => {
  return (
    <nav className="bg-nav font-lora p-4">
      <div className="container mx-auto flex items-center">
        <a href="/" className="flex items-center">
          <img
            src="/android-chrome-192x192.png"
            alt="Logo firmy"
            className="h-12 w-auto"
            width={120}
            height={48}
          />
          <span className="md:hidden text-white font-lora mx-4 items-center gap-[3vw] text-5xl max-[340px]:text-3xl">
            NeuroControl
          </span>
        </a>
        <div className="hidden md:flex mx-4 items-center">
          <ul className="flex gap-8">
            <li>
              <a
                href="/"
                className="text-black font-jersey text-3xl hover:text-gray-200"
              >
                Monitorowanie
              </a>
            </li>
            <li>
              <a
                href="/sterowanie"
                className="text-black font-jersey text-3xl hover:text-gray-200"
              >
                Sterowanie
              </a>
            </li>
            <li>
              <a
                href="/raporty"
                className="text-black font-jersey text-3xl hover:text-gray-200"
              >
                Raporty
              </a>
            </li>
          </ul>
        </div>
        <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-20 bg-nav">
          <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
            <a
              href="/"
              className="inline-flex flex-col items-center justify-center px-5"
            >
              <FontAwesomeIcon
                icon={faChartSimple}
                className="text-3xl text-white"
              />
              <span className="text-sm text-white font-jersey">
                Monitorowanie
              </span>
            </a>
            <a
              href="/sterowanie"
              className="inline-flex flex-col items-center justify-center px-5 "
            >
              <FontAwesomeIcon
                icon={faGamepad}
                className="text-3xl text-white"
              />
              <span className="text-sm text-white font-jersey">Sterowanie</span>
            </a>

            <a
              href="/raporty"
              className="inline-flex  flex-col items-center justify-center px-5 "
            >
              <FontAwesomeIcon icon={faFile} className="text-3xl text-white" />
              <span className="text-sm text-white font-jersey">Raporty</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
