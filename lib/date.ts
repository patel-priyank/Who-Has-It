export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

export const getDaysAgo = (date: string) => {
  const d1 = new Date(date).getTime();
  const d2 = new Date().getTime();

  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
};
