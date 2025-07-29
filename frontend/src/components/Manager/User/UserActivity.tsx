import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "../../../components/Pagination";
import { formatDate } from "../../../utils/format";
import { getActivityIcon, getActivityMessage } from "../../../utils/activity";
import { User_Activities, PageData } from "../../../assets/Data";

type UserActivityProps = {
  activities: User_Activities[];
  pageData: PageData;
  setPageData: React.Dispatch<React.SetStateAction<PageData>>;
};

const UserActivity = ({ activities, pageData, setPageData }: UserActivityProps) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-lora text-white mb-4 pb-2 border-b border-white/10">
        Twoja aktywność
      </h2>

      {activities.length === 0 ? (
        <div className="bg-white/5 rounded-xl p-6 text-center">
          <p className="text-white/70">Nie masz jeszcze żadnej aktywności.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center">
                <div className="bg-accent/30 p-2 rounded-full">
                  <FontAwesomeIcon
                    icon={getActivityIcon(activity.action_type)}
                    className="text-white"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-white">{getActivityMessage(activity)}</p>
                  <p className="text-white/50 text-sm">
                    {formatDate(activity.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-center items-center">
            <Pagination
              pageData={pageData}
              setPageData={setPageData}
              className="mt-5"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActivity;
