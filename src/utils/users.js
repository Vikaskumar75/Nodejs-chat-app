const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }

  const existingUser = users.find(
    (user) => user.username === username && user.room === room
  );
  if (existingUser) {
    return {
      error: "username is in use!",
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  if (!id) return { error: "id is required" };

  const user = users.find((user) => user.id === id);
  if (!user) return { error: "No user found!" };

  return { user };
};

const getUsersInRoom = (room) => {
  if (!room) return { error: "Room name is required" };

  room = room.trim().toLowerCase();
  const _users = users.filter((user) => user.room === room);
  return _users;
};

module.exports = {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
};
