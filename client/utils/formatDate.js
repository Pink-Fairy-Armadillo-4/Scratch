const formatDate = (date) => {
  // const h = '0' + new Date(date).getHours();
  // const m = '0' + new Date(date).getMinutes();

  // return `${h.slice(-2)}:${m.slice(-2)}`;
  return new Date(date).toLocaleTimeString('en-US', { timeStyle: 'short' });
};

export default formatDate;
