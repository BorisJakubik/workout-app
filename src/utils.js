export const formatDate = value => new Intl.DateTimeFormat('sk-SK', { day: 'numeric', month: 'short' }).format(new Date(value));
export const toDateInputValue = value => {
  const date = value ? new Date(value) : new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};
