import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import trailService from "../services/trails.service";
import { PageData, Trails } from "../assets/Data";
import Pagination from "../components/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMountain,
  faCircleArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const RegionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { region } = useParams<{ region: string }>();
  const [trails, setTrails] = useState<Trails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<PageData>({
    page: parseInt(searchParams.get("page") || "1"),
    pages: 1,
  });

  const handleBackClick = () => {
    navigate("/");
  };
  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || "1");
    if (pageData.page !== currentPage) {
      setSearchParams({ page: pageData.page.toString() });
    }
  }, [pageData.page, searchParams, setSearchParams]);
  useEffect(() => {
    if (!region) return;

    setLoading(true);
    trailService
      .gettrailByRegion(region, pageData.page)
      .then((res) => {
        setTrails(res.data.data);
        setPageData((prev) => ({
          ...prev,
          pages: res.data.totalPages,
        }));
      })
      .catch(() => {
        setError("Nie udało się załadować szlaków. Spróbuj ponownie później.");
      })
      .finally(() => setLoading(false));
  }, [region, pageData.page]);

  const handleTrailClick = (trailId: number) => {
    navigate(`/trails/${trailId}`); // Navigate to the trail details page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-grad1 to-grad2 pb-24 md:pb-0">
      <div className="container mx-auto py-12 px-4">
        <div className="relative text-center mb-10">
          <button
            onClick={handleBackClick}
            className="absolute left-4 top-0 flex items-center justify-center text-white hover:text-gray-200 transition-colors duration-200 cursor-pointer"
            aria-label="Powrót"
          >
            <FontAwesomeIcon icon={faCircleArrowLeft} className="text-2xl" />
          </button>
          <h1 className="text-4xl md:text-5xl text-white font-bold mb-3 font-lora">
            Szlaki w {region}
          </h1>
          <div className="w-24 h-1 bg-white mx-auto rounded"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        ) : error ? (
          <div className="bg-white/10 backdrop-blur-sm text-center py-10 rounded-xl border border-white/20 shadow-lg">
            <p className="text-xl text-white">{error}</p>
          </div>
        ) : trails.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm text-center py-10 rounded-xl border border-white/20 shadow-lg">
            <p className="text-xl text-white">
              Nie znaleziono szlaków w regionie {region}.
            </p>
            <p className="mt-3 text-white/70">
              Spróbuj wybrać inny region lub sprawdź później.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trails.map((trail) => (
                <div
                  key={trail.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  <div className="p-5">
                    <h2 className="text-2xl font-lora text-white font-semibold mb-3">
                      {trail.name}
                    </h2>

                    <div className="flex items-center mb-3 space-x-4">
                      <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm">
                        {trail.length_km} km
                      </div>
                      {trail.duration_minutes && (
                        <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm">
                          {Math.floor(trail.duration_minutes / 60)}h{" "}
                          {trail.duration_minutes % 60}min
                        </div>
                      )}
                    </div>

                    <p className="text-white/80 mb-4 line-clamp-3">
                      {trail.description}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-white/70 text-sm">
                        <span className="mr-2">
                          <FontAwesomeIcon icon={faMountain} />
                        </span>
                        {trail.elevation_gain}m przewyższenia
                      </div>
                      <button
                        onClick={() => handleTrailClick(trail.id)}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-white/40 cursor-pointer"
                      >
                        Zobacz szlak
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="mt-10">
          <Pagination
            pageData={pageData}
            setPageData={setPageData}
            className="flex justify-center"
          />
        </div>
      </div>
    </div>
  );
};

export default RegionPage;
