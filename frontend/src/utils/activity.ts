import {
  faRoute,
  faMountain,
  faStar,
  faShareAlt,
  faComment,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

const getActivityMessage = (activity: {
  action_type: string;
  target_name: string;
}) => {
  switch (activity.action_type) {
    case "favorite":
      return `Dodałeś trasę "${activity.target_name}" do ulubionych`;
    case "like":
      return `Polubiłeś trasę "${activity.target_name}"`;
    case "comment":
      return `Skomentowałeś trasę "${activity.target_name}"`;
    case "peak":
      return `Zdobyłeś szczyt "${activity.target_name}"`;
    case "trail":
      return `Utworzyłeś trasę "${activity.target_name}"`;
    case "share":
      return `Udostępniłeś trasę "${activity.target_name}" publicznie`;
    default:
      return `${activity.action_type} "${activity.target_name}"`;
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "favorite":
      return faStar;
    case "comment":
      return faComment;
    case "peak":
      return faMountain;
    case "share":
      return faShareAlt;
    case "like":
      return faThumbsUp;
    case "trail":
      return faRoute;
    default:
      return faRoute;
  }
};

export { getActivityMessage, getActivityIcon };
