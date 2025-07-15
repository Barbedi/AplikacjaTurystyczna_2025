import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PageData } from "../assets/Data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface PaginationProps {
  pageData: PageData;
  setPageData: React.Dispatch<React.SetStateAction<PageData>>;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  pageData,
  setPageData,
  className = "",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Ustaw page z URL (np. przy odświeżeniu strony)
  useEffect(() => {
    const pageFromURL = parseInt(searchParams.get("page") || "1", 10);
    if (pageFromURL !== pageData.page) {
      setPageData((prev) => ({ ...prev, page: pageFromURL }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const pagesArray = Array.from(
    { length: pageData.pages },
    (_, index) => index + 1,
  );

  const pageChangeHandler = (page: number) => {
    setPageData((prev) => ({ ...prev, page }));
    setSearchParams({ page: page.toString() });
  };

  const prevPageHandler = () => {
    if (pageData.page > 1) {
      pageChangeHandler(pageData.page - 1);
    }
  };

  const nextPageHandler = () => {
    if (pageData.page < pageData.pages) {
      pageChangeHandler(pageData.page + 1);
    }
  };

  return (
    <nav aria-label="Page navigation" className={className}>
      <ul className="pagination flex space-x-1">
        <li
          className={`page-item ${pageData.page === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={prevPageHandler}
          title="Poprzednia strona"
        >
          <span className="page-link px-3 py-1 border border-white text-white rounded">
            <FontAwesomeIcon icon={faAngleLeft} />
          </span>
        </li>
        {pagesArray.map((page: number) => (
          <li
            key={page}
            className={`page-item ${page === pageData.page ? "text-white" : "cursor-pointer"}`}
            onClick={() => pageChangeHandler(page)}
          >
            <span
              className={`page-link px-3 py-1 border rounded ${page === pageData.page ? "bg-accent border-accent text-white" : "border-white text-white bg-white/30"}`}
            >
              {page}
            </span>
          </li>
        ))}
        <li
          className={`page-item ${pageData.page === pageData.pages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={nextPageHandler}
          title="Następna strona"
        >
          <span className="page-link px-3 py-1 border border-white text-white rounded">
            <FontAwesomeIcon icon={faAngleRight} />
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
