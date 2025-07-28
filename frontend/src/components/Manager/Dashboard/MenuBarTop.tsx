import { useLocation, Link } from "react-router-dom";
import { pathTranslation } from "../../../utils/pathTranslation";

const MenuBarTop = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  const getDisplayName = (part: string, index: number) => {
    if (/^\d+$/.test(part)) {
      if (
        index > 0 &&
        (pathParts[index - 1] === "crown-poland" ||
          pathParts[index - 1] === "crown-beskid" ||
          pathParts[index - 1] === "peak")
      ) {
        return `Szczyt #${part}`;
      }
      // Jeśli poprzednia część to "edit-peak", wyświetl "Szczyt #ID" (dla kompatybilności wstecznej)
      if (index > 0 && pathParts[index - 1] === "edit-peak") {
        return `Szczyt #${part}`;
      }
      if (index > 0 && pathParts[index - 1] === "my-routes") {
        return `Trasa #${part}`;
      }
      if (index > 0 && pathParts[index - 1] === "my-peaks") {
        return `Szczyt #${part}`;
      }
      if (index > 0 && pathParts[index - 1] === "edit-route") {
        return ` #${part}`;
      }
      if (index > 0 && pathParts[index - 1] === "recommended") {
        return `Trasa #${part}`;
      }
      if (index > 0 && pathParts[index - 1] === "favorite-routes") {
        return `Trasa #${part}`;
      }

      return `ID: ${part}`;
    }

    return pathTranslation[part] || part;
  };

  return (
    <div className="w-full px-4 py-5 flex items-center text-white border-b-2 border-white ">
      {pathParts.map((part, index) => {
        const fullPath = "/" + pathParts.slice(0, index + 1).join("/");
        const isLast = index === pathParts.length - 1;
        const displayName = getDisplayName(part, index);

        return (
          <span
            key={fullPath}
            className="flex items-center justify-between text-lg"
          >
            {!isLast ? (
              <>
                <Link to={fullPath} className="text-gray-600 hover:underline">
                  {displayName}
                </Link>
                <span className="ml-2 text-white">/</span>
              </>
            ) : (
              <span className="text-white">{displayName}</span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default MenuBarTop;
