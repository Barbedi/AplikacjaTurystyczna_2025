import { useEffect, useState } from "react";
import trailsService from "../../../services/trails.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { PageData, Trails } from "../../../assets/Data";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../Pagination";

const TrailPropose = () => {
  const navigate = useNavigate();
  const [trails, setTrails] = useState<Trails[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageData, setPageData] = useState<PageData>({
    page: parseInt(searchParams.get("page") || "1"),
    pages: 1,
  });
  useEffect(() => {
    const fetchTrails = async (page: number) => {
      try {
        const response = await trailsService.getTrailsByPublic(page);
        setTrails(response.data.data);
        setPageData((prev) => ({
          ...prev,
          pages: response.data.totalPages,
        }));
      } catch (error) {
        console.error("Error fetching trails:", error);
      }
    };
    fetchTrails(pageData.page);
  }, [pageData.page]);
  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || "1");
    if (pageData.page !== currentPage) {
      setSearchParams({ page: pageData.page.toString() });
    }
  }, [pageData.page, searchParams, setSearchParams]);
  const handleTrailClick = (trailId: number) => {
    navigate(`/dashboard/recommended/${trailId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-5 mx-auto">
      {trails.map((trail) => (
        <div
          key={trail.id}
          className=" flex bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-4 mt-5 transition-all duration-300 ease-in-out border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-xl w-full"
        >
          <span className="flex-1 text-lg font-lora text-white">
            {trail.name}
          </span>
          <span className="flex-1 text-lg font-lora text-white">
            {trail.region}
          </span>
          <span className="flex-1 text-lg font-lora text-white">
            {trail.length_km} km
          </span>
          <span className="flex-1 text-lg font-lora text-white cursor-pointer">
            <FontAwesomeIcon
              onClick={() => handleTrailClick(trail.id)}
              icon={faChevronRight}
              className="text-white  hover:text-purple-400  cursor-pointer text-lg"
              title="Zobacz szczegóły"
            />
          </span>
        </div>
      ))}
      <Pagination
        pageData={pageData}
        setPageData={setPageData}
        className="mt-5"
      />
    </div>
  );
};

export default TrailPropose;
