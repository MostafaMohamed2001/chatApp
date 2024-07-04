
const generateMessage = (username,txt) => {
  return {
    username,
    txt,
    createAt: new Date().getTime()
  };
}
const generateLocationMessage = (username,url) => {
  return {
    username,
    url,
    createAt: new Date().getTime()
  };
}
module.exports = {
  generateMessage,
  generateLocationMessage
} 