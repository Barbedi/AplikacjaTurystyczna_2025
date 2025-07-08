import { useLocation, Link } from "react-router-dom";
import { pathTranslation } from "../../utils/pathTranslation";

const MenuBarTop = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean); 

  return (
    <div className="w-full px-4 py-5 flex items-center text-white border-b-2 border-white ">
      {pathParts.map((part, index) => {
        const fullPath = "/" + pathParts.slice(0, index + 1).join("/");
        const isLast = index === pathParts.length - 1;

        return (
          <span
            key={fullPath}
            className="flex items-center justify-between text-lg"
          >
            {!isLast ? (
              <>
                <Link to={fullPath} className="text-gray-600 hover:underline">
                  {pathTranslation[part]}
                </Link>
                <span className="ml-2 text-white">/</span>
              </>
            ) : (
              <span className="text-white">{pathTranslation[part]}</span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default MenuBarTop;
