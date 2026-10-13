import React, { useState } from 'react';
import { ObservationData } from '../../types';
import { Target, Search, ArrowRight, RotateCw } from 'lucide-react';

interface FollowUpViewProps {
  observations: ObservationData[];
  onOpenObsDetail: (obsId: string) => void;
  onUpdateObservation: (updated: ObservationData) => void;
}

export const FollowUpView: React.FC<FollowUpViewProps> = ({
  observations,
  onOpenObsDetail,
  onUpdateObservation
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Collect all followups across all observations
  const allFollowups: Array<{
    obsId: string;
    teacherName: string;
    id: string;
    program: string;
    focus: string;
    target: string;
    status: 'Direncanakan' | 'Proses' | 'Selesai';
    pic?: string;
  }> = [];

  observations.forEach(o => {
    if (o.followups) {
      o.followups.forEach(f => {
        allFollowups.push({
          ...f,
          obsId: o.id,
          teacherName: o.teacherName
        });
      });
    }
  });

  const filtered = allFollowups.filter(f => {
    const s = search.toLowerCase();
    const matchSearch =
      f.teacherName.toLowerCase().includes(s) ||
      f.program.toLowerCase().includes(s) ||
      f.focus.toLowerCase().includes(s);

    const matchFilter = filterStatus ? f.status === filterStatus : true;
    return matchSearch && matchFilter;
  });

  const toggleStatus = (obsId: string, fId: string) => {
    const obs = observations.find(o => o.id === obsId);
    if (!obs || !obs.followups) return;

    const list = [...obs.followups];
    const item = list.find(x => x.id === fId);
    if (!item) return;

    const order: Array<'Direncanakan' | 'Proses' | 'Selesai'> = ['Direncanakan', 'Proses', 'Selesai'];
    const nextIdx = (order.indexOf(item.status) + 1) % order.length;
    item.status = order[nextIdx];

    onUpdateObservation({
      ...obs,
      followups: list
    });
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl border border-purple-100 flex-shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Monitoring Rencana Tindak Lanjut Guru</h3>
            <p className="text-xs text-slate-500">
              Pelaksanaan kegiatan mentoring, pelatihan mandiri PMM, dan Komunitas Belajar (Kombel)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama guru, program..."
              className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="">Semua Status</option>
            <option value="Direncanakan">Direncanakan</option>
            <option value="Proses">Dalam Proses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Nama Guru</th>
                <th className="p-3">Bentuk Program / Kegiatan</th>
                <th className="p-3">Fokus Pengembangan</th>
                <th className="p-3">Target Selesai</th>
                <th className="p-3">PIC Penanggung Jawab</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                    Belum ada program tindak lanjut yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr key={`${f.obsId}-${f.id}`} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">{f.teacherName}</td>
                    <td className="p-3 font-semibold text-slate-800">{f.program}</td>
                    <td className="p-3 text-slate-700">{f.focus}</td>
                    <td className="p-3 font-mono text-slate-600">{f.target}</td>
                    <td className="p-3 text-slate-600">{f.pic || 'Kepala Sekolah'}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => toggleStatus(f.obsId, f.id)}
                        title="Klik untuk mengubah status"
                        className={`px-2.5 py-1 rounded-md font-bold text-[10px] transition inline-flex items-center space-x-1 ${
                          f.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : f.status === 'Proses'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span>{f.status}</span>
                        <RotateCw className="w-2.5 h-2.5 ml-1 opacity-70" />
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onOpenObsDetail(f.obsId)}
                        className="text-xs text-indigo-600 font-semibold hover:underline inline-flex items-center space-x-1"
                      >
                        <span>Detail Supervisi</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
