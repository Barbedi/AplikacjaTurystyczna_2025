import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className=" text-white px-4">
        <div className="container mx-auto flex flex-col justify-between items-center">
          <div className="flex space-x-4 md:flex-row flex-col gap-8 mb-4 justify-center items-center">
            <Link to="/about" className="text-xl hover:underline">
              Polityka prywatności
            </Link>
            <Link to="/contact" className="text-xl hover:underline">
              Warunki korzystania
            </Link>
            <Link to="/privacy" className="text-xl hover:underline">
              Kontakt
            </Link>
          </div>
          <div className="text-center md:text-left flex flex-col">
            <p className="text-xl">
              &copy; {new Date().getFullYear()} HikeUp. Wszystkie prawa
              zastrzeżone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
