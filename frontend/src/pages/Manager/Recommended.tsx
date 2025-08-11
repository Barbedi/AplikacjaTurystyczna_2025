import { useContext, useEffect, useState } from "react";
import TrailPropose from "../../components/Manager/Trail/TrailPropose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../store/auth-context";
import useGetUsers from "../../hooks/user/useGetUser";
import { experienceMap, fitnessMap, getAllowedTrailLevels } from "../../utils/proposeTrail";
import { difficultyLabels } from "../../utils/proposeTrail";

const Recommended = () => {
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData } = useGetUsers();
  const [userLevelLabel, setUserLevelLabel] = useState<string>("");

  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);

  useEffect(() => {
    const currentUser = usersData?.[0][0];
    if (currentUser) {
      if (!currentUser.level_of_experience || !currentUser.fitness_level) {
        setUserLevelLabel("Uzupełnij profil !!");
        return;
      }
      
      const exp = experienceMap[currentUser.level_of_experience ?? "beginner"];
      const fit = fitnessMap[currentUser.fitness_level ?? "beginner"];
      const [minDiff, maxDiff] = getAllowedTrailLevels(exp, fit);
      if (minDiff === maxDiff) {
        setUserLevelLabel(difficultyLabels[minDiff]);
      } else {
        setUserLevelLabel(`${difficultyLabels[minDiff]} – ${difficultyLabels[maxDiff]}`);
      }
    } else {
      setUserLevelLabel("Uzupełnij profil");
    }
  }, [usersData]);

  return (
    <div className="flex flex-col max-w-6xl items-center justify-center w-full mx-auto mt-6 gap-y-6">
      <div className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faMapLocationDot}
              className="text-xl text-white"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Polecane Szlaki
            </h1>
            <p className="text-purple-300 text-sm mt-1">
              Trasy dostępne na Twoim poziomie: {userLevelLabel}
            </p>
            <p className="text-gray-300 mt-1">
              Rozwijaj swoje umiejętności i zdobywaj coraz trudniejsze szlaki!
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start w-full">
        <TrailPropose />
      </div>
    </div>
  );
};

export default Recommended;
