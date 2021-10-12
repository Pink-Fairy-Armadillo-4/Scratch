const genRoomId = (...emails) => {
  return emails.sort().join('');
};

export default genRoomId;
