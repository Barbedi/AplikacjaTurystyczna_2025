import {useContext, useEffect,useState } from 'react';
import AuthContext from "../../store/auth-context";
import useGetUsers from "../../hooks/user/useGetUser";
import trailsService from '../../services/trails.service';
import { Trails,PageData } from '../../assets/Data';
import { formatDate } from '../../utils/format';
import Pagination from "../Pagination";
import { useSearchParams,useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons';


const TrailPeak = () => {
     const { user } = useContext(AuthContext);
        const navigate = useNavigate();
     const [searchParams, setSearchParams] = useSearchParams();
     const [trails, setTrails] = useState<Trails[]>([]);
     const [pageData, setPageData] = useState<PageData>({
         page: parseInt(searchParams.get("page") || "1"),
         pages: 1,
       });
  const { getUserByEmail, usersData,  } = useGetUsers();
  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);
  const currentUser = usersData?.[0][0];

  useEffect(() => {
    const fetchUserTrails = async () => {
       try {
        if (!currentUser?.id) {
          console.log("No user ID available yet");
          return;
        }
        const response = await trailsService.getTrailsByUser(currentUser.id.toString(), pageData.page);
        if (response.status === 200) {
            setTrails(response.data.data);
            setPageData(prev => ({
              ...prev,
              pages: response.data.totalPages
            }));
        }
      } catch (err) {
        console.error("Error fetching user trails:", err);
      }
    }
    if (currentUser?.id) {
      fetchUserTrails();
    }
  }, [currentUser?.id, pageData.page]);
  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || "1");
    if (pageData.page !== currentPage) {
      setSearchParams({ page: pageData.page.toString() });
    }
  }, [pageData.page, searchParams, setSearchParams]);

  const chooseTrail = (trail: Trails) => {
    navigate(`/dashboard/my-routes/${trail.id}`);
  }

  return(
        <div className="flex flex-col items-center justify-center w-full mt-5 mx-auto">
            {trails.map((trail) => (
                <div
                key={trail.id}
                 className="flex flex-row items-start justify-start w-full m-1 p-5 bg-accent rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
                >
                <span className="flex-1 text-lg font-lora text-white">
                {trail.name}
                </span>
                <span className="flex-1 text-lg font-lora text-white">
                    {trail.region}
                </span>
                <span className="flex-1 text-lg font-lora text-white">
                    {formatDate(trail.created_at)}
                </span>
                <span className="flex-1 text-lg font-lora text-white">
                    <a onClick={()=>chooseTrail(trail)} className="p-4 cursor-pointer"> Zobacz trase <FontAwesomeIcon icon={faChevronRight} className='ml-2' /> </a>
                </span> 
                </div>
            ))}
            {trails.length === 0 && (
                <div className="text-white text-center mt-5">
                    Nie masz jeszcze żadnych tras.
                </div>
            )}   
            <Pagination
                pageData={pageData}
                setPageData={setPageData}
                className="mt-5"
            /> 
        </div>
  );
};



  export default TrailPeak;
