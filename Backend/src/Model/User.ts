const bcrypt = require("bcrypt");

interface User {
  id: string;
  username: string;
  passwordHash: string;
}

class InMemoryUserDatabase {
  private users: { [key: string]: User } = {};

  // Add a new user (register)
  addUser(username: string, password: string): User {
    const id = Math.random().toString(36).substring(2, 9); // Generate a random user ID
    const passwordHash = bcrypt.hashSync(password, 10); // Hash the password
    const user = { id, username, passwordHash };
    this.users[username] = user;
    return user;
  }

  // Get user by username
  getUserByUsername(username: string): User | undefined {
    return this.users[username];
  }
}

export const userDB = new InMemoryUserDatabase();
