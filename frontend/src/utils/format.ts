export const formatTime = (timestamp: number): string =>
  new Date(timestamp * 1000).toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
export const timeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000); 

  if (diff < 60) {
    return 'przed chwilą';
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} ${minutes === 1 ? 'minutę' : minutes <= 4 ? 'minuty' : 'minut'} temu`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} ${hours === 1 ? 'godzinę' : hours <= 4 ? 'godziny' : 'godzin'} temu`;
  } else {
    const days = Math.floor(diff / 86400);
    return `${days} ${days === 1 ? 'dzień' : days <= 4 ? 'dni' : 'dni'} temu`;
  }
}