import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Dummy user (anggap database)
  private users = [
    {
      id: 1,
      username: 'user1',
      password: 'password1', // langsung plain text
    },
  ];

  async validateUser(username: string, password: string) {
    const user = this.users.find(u => u.username === username);
    if (user && password === user.password) {
      return user;
    }
    return null;
  }

  async login(username: string, password: string) {
  const user = await this.validateUser(username, password);
  if (!user) {
    return {
      status: 'error',
      message: 'Invalid credentials',
      token: null,
    };
  }

  const payload = { sub: user.id, username: user.username };
  const token = this.jwtService.sign(payload);

  return {
    status: 'success',
    message: 'Login berhasil',
    token,
  };
}

}