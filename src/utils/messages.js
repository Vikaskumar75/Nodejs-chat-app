const getMessage = (username, message) => {
  return {
    username,
    text: message,
    createdAt: new Date().getTime(),
  };
};
const generateLocationMessages = (username, latitude, longitude) => {
  return {
    username,
    url: `https://google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  getMessage,
  generateLocationMessages,
};
