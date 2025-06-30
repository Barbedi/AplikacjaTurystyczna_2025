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
