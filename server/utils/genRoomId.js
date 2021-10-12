const genRoomId = (...emails) => {
  return emails.sort().join('');
};

module.exports = genRoomId;
