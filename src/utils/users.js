const users = [];


const addUser = ({ id, username, room }) => {
  

  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  
  if (!username || !room) { 
    return { error: 'Username and room are required.' };
  }
  const existingUser = users.find((user) => {
    return user.username === username && user.room === room;
  })
  if (existingUser) {
    return {
      error: 'Username and room is in use'
    }
  }
  const user = { id, username, room };
  users.push(user);
  // console.log(users)
  return {
  user
  }
  
} 

const removeUser = (id) => {
  const idx = users.findIndex((user) => user.id === id)
  if (idx !== -1) {
       return users.splice(idx ,1)[0]
  }
}




const getUser = (id) => {
  return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((users)=> users.room === room)
} 


// addUser({
//   id: 1,
//   username: 'ali',
//   room: 'egy'
// })
// addUser({
//   id: 2,
//   username: 'mohammad',
//   room: 'egy'
// })
// addUser({
//   id: 3,
//   username: 'hussein',
//   room: 'usa'
// })
// const user = getUsersInRoom('egy   ')
// console.log(user)

module.exports = {
  addUser,
  removeUser,
  getUsersInRoom,
  getUser
  
}
// console.log(getUsersInRoom('egy'))


// console.log(findUser(1))

