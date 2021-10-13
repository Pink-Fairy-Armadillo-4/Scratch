const formatDate = (date) => {
  const h = '0' + new Date(date).getHours();
  const m = '0' + new Date(date).getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
};

export default formatDate;
