const pad = (value: number) => {
  return String(value).padStart(2, '0');
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

export const toDateTimeLocal = (date: string | null) => {
  if (!date) {
    return '';
  }

  const d = new Date(date);

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const nowDateTimeLocal = () => {
  return toDateTimeLocal(new Date().toISOString());
};
