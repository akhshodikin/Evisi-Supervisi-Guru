import React from 'react';
import { ObservationData, Teacher, NavView } from '../../types';
import { TeacherScoreBarChart, CategoryDonutChart } from '../Charts';
import { SupervisionTrendChart } from '../charts/SupervisionTrendChart';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Star, 
  PlusCircle, 
  ArrowRight, 
  Compass, 
  BarChart2, 
  PieChart as PieChartIcon, 
  ListFilter
} from 'lucide-react';

interface DashboardViewProps {
  teachers: Teacher[];
  observations: ObservationData[];
  schoolName?: string;
  onNavigate: (view: NavView) => void;
  onOpenObsDetail: (obsId: string) => void;
  onOpenNewObs: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  teachers,
  observations,
  schoolName,
  onNavigate,
  onOpenObsDetail,
  onOpenNewObs
}) => {
  const totalTeachers = teachers.length;
  const completedObs = observations.filter(o => o.status === 'Selesai');
  const inProgressObs = observations.filter(o => o.status !== 'Selesai');
  const totalObs = observations.length;
  const percentCompleted = totalObs > 0 ? Math.round((completedObs.length / totalObs) * 100) : 0;

  // Average score
  const gradedObs = observations.filter(o => o.score > 0);
  const avgScore = gradedObs.length > 0
    ? (gradedObs.reduce((sum, o) => sum + o.score, 0) / gradedObs.length).toFixed(1)
    : '0.0';

  const numAvg = parseFloat(avgScore);
  let avgPredicate = 'Belum Ada Penilaian';
  if (numAvg >= 90) avgPredicate = 'Sangat Baik (A)';
  else if (numAvg >= 80) avgPredicate = 'Baik (B)';
  else if (numAvg >= 70) avgPredicate = 'Cukup (C)';
  else if (numAvg > 0) avgPredicate = 'Perlu Pembinaan (D)';

  // Chart data
  const barChartData = observations.map(o => ({
    label: o.teacherName.split(',')[0].split(' ')[0], // Short first name
    value: o.score,
    teacherName: o.teacherName,
    subject: `${o.subject} (${o.classTarget})`
  }));

  const sbCount = observations.filter(o => o.score >= 90).length;
  const bCount = observations.filter(o => o.score >= 80 && o.score < 90).length;
  const cCount = observations.filter(o => o.score >= 70 && o.score < 80).length;
  const pCount = observations.filter(o => o.score > 0 && o.score < 70).length;
  const blmCount = observations.filter(o => o.score === 0).length;

  const donutCategories = [
    { label: 'Sangat Baik (≥90)', count: sbCount, color: '#10b981' },
    { label: 'Baik (80-89)', count: bCount, color: '#0ea5e9' },
    { label: 'Cukup (70-79)', count: cCount, color: '#f59e0b' },
    { label: 'Perlu Pembinaan (<70)', count: pCount, color: '#ef4444' },
    { label: 'Belum Dinilai', count: blmCount, color: '#cbd5e1' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pra Observasi':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Pra (Goal)</span>;
      case 'Observasi':
        return <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-bold text-[10px]">Observasi (Reality)</span>;
      case 'Pasca Observasi':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">Pasca (Options)</span>;
      case 'Tindak Lanjut':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold text-[10px]">Tindak Lanjut (Will)</span>;
      case 'Selesai':
        return <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-bold text-[10px]">Selesai</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3.5 hover:border-slate-300 transition">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Guru</p>
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{totalTeachers}</h3>
            <span className="text-[10px] text-slate-400">Guru {schoolName || 'Sekolah'}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3.5 hover:border-slate-300 transition">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Observasi Selesai</p>
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{completedObs.length}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">{percentCompleted}% Terlaksana</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3.5 hover:border-slate-300 transition">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Sedang Berjalan</p>
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{inProgressObs.length}</h3>
            <span className="text-[10px] text-amber-600 font-semibold">Tahap G-R-O-W</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3.5 hover:border-slate-300 transition">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100 flex-shrink-0">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Rata-rata Nilai</p>
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{avgScore}</h3>
            <span className="text-[10px] text-purple-600 font-semibold">{avgPredicate}</span>
          </div>
        </div>
      </div>

      {/* GROW Coaching Framework Banner with Official Logo */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3.5">
            <div className="h-14 w-auto min-w-[110px] max-w-[150px] bg-white rounded-xl px-2.5 py-1 shadow-sm border border-slate-700/60 hidden sm:flex items-center justify-center flex-shrink-0">
              <img src="/logo.png" alt="e-Visi Supervisi Guru Alur GROW" className="h-full w-auto object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
                  e-Visi Supervisi Guru
                </span>
                <span className="text-xs text-slate-400">• Alur GROW</span>
              </div>
              <h3 className="font-bold text-base text-white mt-1">Kerangka Supervisi Berbasis Alur GROW Coaching</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pendampingan reflektif tanpa menghakimi untuk perbaikan proses belajar mengajar Kurikulum Merdeka & Pengelolaan Kinerja PMM
              </p>
            </div>
          </div>
          <button
            onClick={onOpenNewObs}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition self-start flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Jadwalkan Observasi</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 hover:border-emerald-500/40 transition">
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold text-[10px]">G - GOAL</span>
            <h4 className="font-semibold text-slate-100 mt-1.5">1. Pra Observasi</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Penetapan target capaian murid, kesepakatan indikator observasi, dan modul ajar guru.
            </p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 hover:border-sky-500/40 transition">
            <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded font-bold text-[10px]">R - REALITY</span>
            <h4 className="font-semibold text-slate-100 mt-1.5">2. Pengamatan Kelas</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Perekaman fakta objektif, diferensiasi proses, dan aktivitas nyata murid di kelas.
            </p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 hover:border-amber-500/40 transition">
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold text-[10px]">O - OPTIONS</span>
            <h4 className="font-semibold text-slate-100 mt-1.5">3. Pasca Coaching</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Refleksi terbimbing, penemuan alternatif pemecahan masalah secara mandiri oleh guru.
            </p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 hover:border-purple-500/40 transition">
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded font-bold text-[10px]">W - WILL</span>
            <h4 className="font-semibold text-slate-100 mt-1.5">4. Tindak Lanjut</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Komitmen aksi nyata perbaikan, Kombel, mentoring rekan sejawat, dan tindak lanjut terukur.
            </p>
          </div>
        </div>
      </div>

      {/* Recharts Supervision Trend Visualization */}
      <SupervisionTrendChart observations={observations} />

      {/* 2 Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-800 text-sm flex items-center">
              <BarChart2 className="w-4 h-4 text-emerald-600 mr-2" />
              <span>Hasil Nilai Observasi per Guru</span>
            </h4>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono font-semibold">
              Skala 0 - 100
            </span>
          </div>
          <div className="h-64 relative flex items-center justify-center">
            <TeacherScoreBarChart data={barChartData} />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-800 text-sm flex items-center">
              <PieChartIcon className="w-4 h-4 text-sky-600 mr-2" />
              <span>Distribusi Capaian Supervisi</span>
            </h4>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-semibold">
              Kategori Predikat
            </span>
          </div>
          <div className="h-64 relative flex items-center justify-center">
            <CategoryDonutChart categories={donutCategories} />
          </div>
        </div>
      </div>

      {/* Recent Observations List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-bold text-slate-800 text-sm flex items-center">
            <ListFilter className="w-4 h-4 text-indigo-600 mr-2" />
            <span>Daftar Supervisi Terkini</span>
          </h4>
          <button
            onClick={() => onNavigate('observations')}
            className="text-xs text-emerald-700 font-semibold hover:underline flex items-center space-x-1"
          >
            <span>Lihat Semua ({observations.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Tanggal / No</th>
                <th className="p-3">Nama Guru</th>
                <th className="p-3">Mata Pelajaran &amp; Kelas</th>
                <th className="p-3">Observer</th>
                <th className="p-3">Skor / Predikat</th>
                <th className="p-3">Status Alur GROW</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {observations.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-semibold text-slate-800">
                    {o.date}
                    <br />
                    <span className="text-[10px] text-slate-400 font-normal">{o.id}</span>
                  </td>
                  <td className="p-3 font-medium text-slate-800">{o.teacherName}</td>
                  <td className="p-3">
                    <span className="font-medium text-slate-700">{o.subject}</span>
                    <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 font-semibold">
                      {o.classTarget}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{o.observer}</td>
                  <td className="p-3">
                    <span className="font-extrabold text-emerald-700">{o.score}</span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span className="text-slate-600 font-medium">{o.category}</span>
                  </td>
                  <td className="p-3">{getStatusBadge(o.status)}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenObsDetail(o.id)}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold text-[11px] transition inline-flex items-center space-x-1"
                    >
                      <span>Buka GROW</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
