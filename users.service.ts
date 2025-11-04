import { Injectable } from '@nestjs/common';

interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  role: string;
  kelas?: string;   // contoh: "XII RPL 1"
}

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  // ➡️ Tambah 1 user
  createUser(
    name: string,
    username: string,
    password: string,
    role: string,
    kelas?: string,
  ): User {
    const newUser: User = {
      id: this.idCounter++,
      name,
      username,
      password,
      role,
      kelas,
    };
    this.users.push(newUser);
    return newUser;
  }

  // ➡️ Tambah banyak user sekaligus
  createMany(
    users: { name: string; username: string; password: string; role: string; kelas?: string }[],
  ): User[] {
    const newUsers: User[] = users.map(u => ({
      id: this.idCounter++,
      name: u.name,
      username: u.username,
      password: u.password,
      role: u.role,
      kelas: u.kelas,
    }));
    this.users.push(...newUsers);
    return newUsers;
  }

  // ➡️ Ambil semua user
  getAllUsers(): User[] {
    return this.users;
  }

  // ➡️ Ambil user by ID
  getUserById(id: number): User | null {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  // ➡️ Update user
  updateUser(
    id: number,
    name: string,
    username: string,
    password: string,
    role: string,
    kelas?: string,
  ): User | null {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return null;
    }
    const updatedUser: User = {
      ...this.users[userIndex],
      name,
      username,
      password,
      role,
      kelas,
    };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  // ➡️ Hapus user
  deleteUser(id: number): boolean {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return false;
    }
    this.users.splice(userIndex, 1);
    return true;
  }
}