import { faFloppyDisk, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import communitytrailsService from "../../services/communitytrails.service";
import userService from "../../services/user.service";
import { useParams,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ExtendedCommunityTrails,Trails,UserInfo } from "../../assets/Data";
import filesService from "../../services/files.service";
import { formatTime ,timeAgo } from "../../utils/format";
import trailsService from "../../services/trails.service";



const CommunityTrails = () => {
    const navigate = useNavigate();
  const [trail, setTrail] = useState<ExtendedCommunityTrails | null>(null);
    const [trailsData, setTrailsData] = useState<Trails[]>([]);
  const [, setUser] = useState<UserInfo | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { id: sharedTrailId } = useParams<{ id: string }>();

  useEffect(() => {
  if (!sharedTrailId) return;

  const fetchData = async () => {
    try {
      const trailResponse = await communitytrailsService.getCommunityTrailDetails(
        parseInt(sharedTrailId, 10)
      );
      const trailData = trailResponse.data;

      if (!trailData || !trailData.user_id) {
        throw new Error("Brak user_id w danych trasy");
      }

      setTrail(trailData);
      console.log("Pobrana trasa:", trailData);
      const trailsDataDetails = await trailsService.getTrailById(trailData.trail_id);
        setTrailsData([trailsDataDetails.data]);
      const userResponse = await userService.getById(trailData.user_id);
      const userData = userResponse.data.data[0];

      setUser(userData);
      console.log("Pobrany użytkownik:", userData);
      setPreviewUrl(filesService.getImgUrl(userData.profile_image));

    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error);
    }
  };

  fetchData();
}, [sharedTrailId, previewUrl]);

const handleEditTrail = () => {
  navigate(`/dashboard/community-trails/edit/${trail?.trail_id}`);
};

  return (
          <div className="max-w-5xl mx-auto  w-full">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 mb-6 overflow-hidden hover:shadow-lg transition-all duration-300 hover:bg-white/15">
                  <div className="p-6 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                          <img 
                              className="rounded-full h-12 w-12 object-cover ring-2 ring-white/30"
                              src={previewUrl || ""}
                              alt="User Avatar" 
                          />
                          <div className="flex flex-col">
                              <span className="text-white font-medium">{trail?.user_name}</span>
                              <span className="text-gray-300 text-sm">{timeAgo(trail?.created_at || "")}</span>
                          </div>
                          <FontAwesomeIcon icon={faHeart}
                          title="Polubienia" 
                          className="text-white text-2xl hover:text-red-500 transition-colors cursor-pointer ml-auto" />
                          <FontAwesomeIcon icon={faFloppyDisk}
                          title="Zapisz trasę" 
                          className="text-white text-2xl hover:text-accent transition-colors cursor-pointer ml-2" />
                      </div>
                  </div>
                  <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-3">{trail?.trail_name}</h3>
                      <p className="text-gray-300 mb-5">
                          {trail?.shared_description || "Brak opisu trasy."}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white/5 p-3 rounded-lg">
                              <p className="text-gray-400 text-xs mb-1">Długość</p>
                              <p className="text-white font-medium">{trailsData[0]?.length_km || "Brak danych"}</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg">
                              <p className="text-gray-400 text-xs mb-1">Czas przejścia</p>
                              <p className="text-white font-medium">{formatTime(trailsData[0]?.duration_minutes as number) || "Brak danych"}</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg">
                              <p className="text-gray-400 text-xs mb-1">Przewyższenie</p>
                              <p className="text-white font-medium">{trailsData[0]?.elevation_gain || "Brak danych"} m</p>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg">
                              <p className="text-gray-400 text-xs mb-1">Trudność</p>
                              <p className="text-white font-medium">{trailsData[0]?.difficulty || "Brak danych"}</p>
                          </div>
                      </div>
                      <div className="flex justify-end mt-6 gap-3">
                          <button
                           onClick={handleEditTrail}
                           className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                              Zobacz trasę
                          </button>
                      </div>
                  </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 mt-6 mb-6 overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                      <h3 className="text-white font-medium">Komentarze (1)</h3>
                  </div>
                  <div className="p-4 border-b border-white/10">
                      <div className="flex gap-3">
                          <img 
                              className="rounded-full h-10 w-10 object-cover bg-amber-400/50 ring-1 ring-white/30"
                              src="" 
                              alt="Your Avatar" 
                          />
                          <div className="flex-grow">
                              <textarea 
                                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                                  placeholder="Dodaj komentarz..."
                                  rows={2}
                              ></textarea>
                              <div className="flex justify-end mt-2">
                                  <button className="px-4 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all text-sm">
                                      Opublikuj
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="divide-y divide-white/10">
                      <div className="p-4">
                          <div className="flex gap-3">
                              <img 
                                  className="rounded-full h-10 w-10 object-cover bg-blue-400/50 ring-1 ring-white/30"
                                  src="" 
                                  alt="User Avatar" 
                              />
                              <div className="flex-grow">
                                  <div className="flex items-center gap-2">
                                      <span className="text-white font-medium">Anna</span>
                                      <span className="text-gray-400 text-xs">2 godziny temu</span>
                                  </div>
                                  <p className="text-gray-300 mt-1">
                                      Super trasa! Przeszłam ją w zeszłym miesiącu, widoki są niesamowite.
                                  </p>
                              </div>
                          </div>
                      </div>
  
                      <div className="p-4 flex justify-center">
                          <button className="px-4 py-1.5 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all text-sm">
                              Pokaż więcej komentarzy
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  };
export default CommunityTrails;
