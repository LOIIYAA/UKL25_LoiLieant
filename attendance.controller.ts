import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { UsersService } from 'src/users/users.service';

@Controller('api/attendance')
export class AttendanceController {
  constructor(
    private attendanceService: AttendanceService,
    private usersService: UsersService,   // ✅ inject UsersService
) {}

  @Post()
  create(@Body() body: any) {
    if (Array.isArray(body)) {
      const attendances = this.attendanceService.createManyAttendance(body);
      return {
        status: 'success',
        message: 'Beberapa presensi berhasil dicatat',
        data: attendances,
      };
    } else {
      const attendance = this.attendanceService.createAttendance(
        body.user_id,
        body.date,
        body.time,
        body.status,
      );
      return {
        status: 'success',
        message: 'Presensi berhasil dicatat',
        data: attendance,
      };
    }
  }

  @Get()
  findAll() {
    return {
      status: 'success',
      message: 'Daftar presensi',
      data: this.attendanceService.getAllAttendance(),
    };
  }

  @Get('history/:user_id')
getHistory(@Param('user_id') user_id: string) {
  const history = this.attendanceService.getHistoryByUser(+user_id);
  if (history.length === 0) {
    return { status: 'error', message: 'Belum ada riwayat presensi untuk user ini', data: [] };
  }
  return {
    status: 'success',
    data: history,
  };
}

@Get('summary/:user_id')
getSummary(
  @Param('user_id') user_id: string,
  @Body() body?: { month?: string; year?: string }
) {
  // Default: bulan & tahun sekarang
  const now = new Date();
  const month = body?.month || String(now.getMonth() + 1).padStart(2, '0');
  const year = body?.year || String(now.getFullYear());

  const summary = this.attendanceService.getMonthlySummary(+user_id, month, year);

  return {
    status: 'success',
    data: {
      user_id: +user_id,
      month: `${month}-${year}`,
      attendance_summary: summary,
    },
  };
}
@Post('analysis')
analysis(
  @Body() body: { start_date: string; end_date: string; group_by: 'kelas' | 'jabatan' }
) 
{
  const users = this.usersService.getAllUsers(); // inject UsersService ke constructor
  const result = this.attendanceService.getAnalysis(
    body.start_date,
    body.end_date,
    body.group_by,
    users,
  );

  return {
    success: true,
    message: 'Success',
    data: { group_analysis: result },
  };
}



}