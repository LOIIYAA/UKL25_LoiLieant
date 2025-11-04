import { Controller, Post, Get, Put, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() body: any) {
    if (Array.isArray(body)) {
      const users = this.usersService.createMany(body);
      return {
        status: 'success',
        message: 'Beberapa pengguna berhasil ditambahkan',
        data: users.map(u => ({
          id: u.id,
          name: u.name,
          username: u.username,
          role: u.role,
          kelas: u.kelas,   //  tambahin kelas
        })),
      };
    } else {
      const user = this.usersService.createUser(
        body.name,
        body.username,
        body.password,
        body.role,
        body.kelas,   //  tambahin kelas
      );
      return {
        status: 'success',
        message: 'Pengguna berhasil ditambahkan',
        data: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          kelas: user.kelas,   //  tambahin kelas
        },
      };
    }
  }

  @Get()
  findAll() {
    const users = this.usersService.getAllUsers();
    return {
      status: 'success',
      message: 'Daftar pengguna',
      data: users.map(u => ({
        id: u.id,
        name: u.name,
        username: u.username,
        role: u.role,
        kelas: u.kelas,   //  tambahin kelas
      })),
    };
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name: string; username: string; password: string; role: string; kelas?: string },
  ) {
    const user = this.usersService.updateUser(
      +id,
      body.name,
      body.username,
      body.password,
      body.role,
      body.kelas,   //  tambahin kelas
    );
    if (!user) {
      return { status: 'error', message: 'User tidak ditemukan', data: null };
    }
    return {
      status: 'success',
      message: 'Pengguna berhasil diubah',
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        kelas: user.kelas,   //  tambahin kelas
      },
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.usersService.getUserById(+id);
    if (!user) {
      return { status: 'error', message: 'User tidak ditemukan', data: null };
    }
    return {
      status: 'success',
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        kelas: user.kelas,   //  tambahin kelas
      },
    };
  }
}