import { Injectable } from '@nestjs/common';

export interface Attendance {
  attendance_id: number;
  user_id: number;
  date: string;
  time: string;
  status: string;
}

@Injectable()
export class AttendanceService {
  private attendances: Attendance[] = [];
  private idCounter = 1;

  // ➡️ Single insert
  createAttendance(user_id: number, date: string, time: string, status: string): Attendance {
    const newAttendance: Attendance = {
      attendance_id: this.idCounter++,
      user_id,
      date,
      time,
      status,
    };
    this.attendances.push(newAttendance);
    return newAttendance;
  }

  // ➡️ Batch insert
  createManyAttendance(records: { user_id: number; date: string; time: string; status: string }[]): Attendance[] {
    const newRecords = records.map(r => ({
      attendance_id: this.idCounter++,
      user_id: r.user_id,
      date: r.date,
      time: r.time,
      status: r.status,
    }));
    this.attendances.push(...newRecords);
    return newRecords;
  }

  getAllAttendance(): Attendance[] {
    return this.attendances;
  }

  getAttendanceByUser(user_id: number): Attendance[] {
    return this.attendances.filter(a => a.user_id === user_id);
  }
  getHistoryByUser(user_id: number) {
  return this.attendances
    .filter(a => a.user_id === user_id)
    .map(a => ({
      attendance_id: a.attendance_id,
      date: a.date,
      time: a.time,
      status: a.status,
    }));
}
getMonthlySummary(user_id: number, month: string, year: string) {
  // Filter presensi sesuai user dan bulan-tahun
  const records = this.attendances.filter(a => {
    const [y, m] = a.date.split('-'); // format YYYY-MM-DD
    return a.user_id === user_id && m === month && y === year;
  });

  // Hitung jumlah tiap status
  const summary = {
    hadir: records.filter(r => r.status === 'hadir').length,
    izin: records.filter(r => r.status === 'izin').length,
    sakit: records.filter(r => r.status === 'sakit').length,
    alpa: records.filter(r => r.status === 'alpa').length,
  };

  return summary;
}

getAnalysis(start_date: string, end_date: string, group_by: 'kelas' | 'jabatan', users: any[]) {
  const start = new Date(start_date);
  const end = new Date(end_date);

  // Filter presensi sesuai periode
  const records = this.attendances.filter(a => {
    const d = new Date(a.date);
    return d >= start && d <= end;
  });

  // Kelompokkan berdasarkan group_by
  const groups: Record<string, any[]> = {};
  records.forEach(r => {
    const user = users.find(u => u.id === r.user_id);
    const groupKey = user?.[group_by] || 'Unknown';
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(r);
  });

  // Hitung total & persentase tiap group
  return Object.entries(groups).map(([group, recs]) => {
    const total = recs.length;
    const hadir = recs.filter(r => r.status === 'hadir').length;
    const izin = recs.filter(r => r.status === 'izin').length;
    const sakit = recs.filter(r => r.status === 'sakit').length;
    const alpha = recs.filter(r => r.status === 'alpa').length;

    return {
      group,
      sakit_percentage: (sakit / total) * 100,
      izin_percentage: (izin / total) * 100,
      alpha_percentage: (alpha / total) * 100,
      hadir_percentage: (hadir / total) * 100,
      total: { hadir, sakit, izin, alpha },
    };
  });
}

}
