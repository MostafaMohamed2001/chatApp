const socket = io('http://localhost:8000');
// socket.on('connect', () => {
//   console.log('Connected to server');
// });
// socket.on('disconnect', () => {
//   console.log('Disconnected from server');
// });
socket.on('countUpdated', () => {
  console.log('The count updated')
})