import React, { useState, useMemo } from 'react';
import { ObservationData } from '../../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { TrendingUp, Calendar, Award, CheckCircle, ArrowUpRight, BarChart3 } from 'lucide-react';

interface SupervisionTrendChartProps {
  observations: ObservationData[];
}

interface TrendChartPoint {
  id?: string;
  rawDate?: string;
  displayDate: string;
  fullDate?: string;
  score?: number;
  avgScore: number;
  minScore?: number;
  maxScore?: number;
  count?: number;
  teacherName?: string;
  subject?: string;
  classTarget?: string;
  category?: string;
  targetScore: number;
}

export const SupervisionTrendChart: React.FC<SupervisionTrendChartProps> = ({ observations }) => {
  const [viewMode, setViewMode] = useState<'chronological' | 'monthly'>('chronological');

  // Filter only graded observations and sort chronologically
  const gradedObs = useMemo(() => {
    return observations
      .filter(o => o.score > 0 && o.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [observations]);

  // Chronological data with cumulative moving average
  const chronologicalData: TrendChartPoint[] = useMemo(() => {
    let runningSum = 0;
    return gradedObs.map((obs, idx) => {
      runningSum += obs.score;
      const runningAvg = Number((runningSum / (idx + 1)).toFixed(1));
      
      const dateObj = new Date(obs.date);
      const displayDate = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        : obs.date;

      return {
        id: obs.id,
        rawDate: obs.date,
        displayDate,
        fullDate: obs.date,
        score: obs.score,
        avgScore: runningAvg,
        teacherName: obs.teacherName,
        subject: obs.subject,
        classTarget: obs.classTarget,
        category: obs.category,
        targetScore: 80
      };
    });
  }, [gradedObs]);

  // Monthly aggregated data
  const monthlyData: TrendChartPoint[] = useMemo(() => {
    const monthGroups: Record<string, { sum: number; count: number; scores: number[]; rawDate: string }> = {};

    gradedObs.forEach(obs => {
      const monthKey = obs.date.substring(0, 7); // e.g. "2026-09"
      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = { sum: 0, count: 0, scores: [], rawDate: obs.date };
      }
      monthGroups[monthKey].sum += obs.score;
      monthGroups[monthKey].count += 1;
      monthGroups[monthKey].scores.push(obs.score);
    });

    const sortedMonths = Object.keys(monthGroups).sort();
    return sortedMonths.map(mKey => {
      const g = monthGroups[mKey];
      const avg = Number((g.sum / g.count).toFixed(1));
      const min = Math.min(...g.scores);
      const max = Math.max(...g.scores);

      const [year, month] = mKey.split('-');
      const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      const displayDate = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

      return {
        id: mKey,
        rawDate: g.rawDate,
        displayDate,
        fullDate: displayDate,
        score: avg,
        avgScore: avg,
        minScore: min,
        maxScore: max,
        count: g.count,
        targetScore: 80
      };
    });
  }, [gradedObs]);

  const activeData: TrendChartPoint[] = viewMode === 'chronological' ? chronologicalData : monthlyData;

  // Key stats
  const stats = useMemo(() => {
    if (chronologicalData.length === 0) {
      return { initialScore: 0, latestScore: 0, diff: 0, isGrowth: true, currentAvg: 0, highest: 0 };
    }
    const initialScore = chronologicalData[0].score ?? 0;
    const latestScore = chronologicalData[chronologicalData.length - 1].score ?? 0;
    const latestAvg = chronologicalData[chronologicalData.length - 1].avgScore;
    const diff = Number((latestScore - initialScore).toFixed(1));
    const highest = Math.max(...chronologicalData.map(d => d.score ?? 0));

    return {
      initialScore,
      latestScore,
      currentAvg: latestAvg,
      diff,
      isGrowth: diff >= 0,
      highest
    };
  }, [chronologicalData]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (viewMode === 'chronological') {
        return (
          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs min-w-[210px] space-y-1.5 animate-fade-in">
            <div className="border-b border-slate-700 pb-1.5 flex justify-between items-center">
              <span className="font-bold text-amber-400">{data.teacherName}</span>
              <span className="text-[10px] text-slate-400 font-mono">{data.fullDate}</span>
            </div>
            <p className="text-[11px] text-slate-300">
              {data.subject} ({data.classTarget})
            </p>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-slate-400">Nilai Observasi:</span>
              <span className="font-extrabold text-sky-400 text-sm">{data.score}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Rata-rata Berjalan:</span>
              <span className="font-bold text-emerald-400">{data.avgScore}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
              <span className="text-slate-400">Predikat:</span>
              <span className="font-semibold text-emerald-300">{data.category}</span>
            </div>
          </div>
        );
      }

      // Monthly mode tooltip
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs min-w-[200px] space-y-1.5 animate-fade-in">
          <div className="border-b border-slate-700 pb-1.5 flex justify-between items-center">
            <span className="font-bold text-amber-400">{data.displayDate}</span>
            <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
              {data.count} Guru
            </span>
          </div>
          <div className="pt-1 flex items-center justify-between">
            <span className="text-slate-400">Nilai Rata-rata:</span>
            <span className="font-extrabold text-emerald-400 text-sm">{data.avgScore}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Rentang Nilai:</span>
            <span className="font-mono text-slate-200">{data.minScore} - {data.maxScore}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
            <span className="text-slate-400">Target Standar:</span>
            <span className="font-semibold text-emerald-400">≥ 80.0</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (activeData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center py-12">
        <div className="p-3 bg-slate-100 rounded-full text-slate-400 mb-3">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h4 className="font-bold text-slate-700 text-sm mb-1">Belum Ada Riwayat Nilai Supervisi</h4>
        <p className="text-xs text-slate-500 max-w-sm">
          Grafik tren perkembangan nilai rata-rata supervisi akan otomatis terbentuk saat observasi guru selesai dinilai.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Tren Nilai Rata-rata Supervisi Guru
              </h3>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Visualisasi Recharts
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Progres mutu dan dinamika capaian pembelajaran dari waktu ke waktu
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('chronological')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              viewMode === 'chronological'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Kronologis Observasi</span>
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              viewMode === 'monthly'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Agregasi Bulanan</span>
          </button>
        </div>
      </div>

      {/* Highlights Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
        <div className="space-y-0.5">
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
            Rata-rata Terkini
          </span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-lg font-black text-emerald-600 font-mono">
              {stats.currentAvg}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
              {stats.currentAvg >= 90 ? 'Sangat Baik' : 'Baik'}
            </span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
            Dinamika Perkembangan
          </span>
          <div className="flex items-baseline space-x-1">
            <span className={`text-lg font-black font-mono ${stats.isGrowth ? 'text-emerald-600' : 'text-amber-600'}`}>
              {stats.diff > 0 ? `+${stats.diff}` : stats.diff}
            </span>
            <span className="text-[10px] font-medium text-slate-500 flex items-center">
              {stats.isGrowth ? (
                <span className="text-emerald-600 flex items-center font-semibold">
                  <ArrowUpRight className="w-3 h-3" /> Tren Positif
                </span>
              ) : (
                'Stabil'
              )}
            </span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
            Nilai Tertinggi Dicapai
          </span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-lg font-black text-sky-600 font-mono">
              {stats.highest}
            </span>
            <span className="text-[10px] text-slate-500 flex items-center">
              <Award className="w-3 h-3 text-amber-500 mr-0.5" /> Skor Puncak
            </span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
            Standar Ketuntasan Mutu
          </span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-lg font-black text-slate-800 font-mono">
              80.0
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
              <CheckCircle className="w-3 h-3 mr-0.5" /> Terlampaui
            </span>
          </div>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={activeData}
            margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="scoreBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />

            <YAxis
              domain={[60, 100]}
              ticks={[60, 70, 80, 90, 100]}
              stroke="#64748b"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 500 }}
            />

            {/* Benchmark Target Line */}
            <ReferenceLine
              y={80}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Target Baik (80)',
                position: 'insideBottomRight',
                fill: '#059669',
                fontSize: 10,
                fontWeight: 600
              }}
            />

            {/* Area for Cumulative Average Trend */}
            <Area
              type="monotone"
              dataKey="avgScore"
              name="Tren Nilai Rata-rata"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#trendGradient)"
              activeDot={{ r: 6, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
            />

            {/* Line for Individual Observation Score (in chronological mode) */}
            {viewMode === 'chronological' && (
              <Line
                type="monotone"
                dataKey="score"
                name="Nilai Observasi Guru"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 4, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mr-1.5"></span>
            Garis Hijau: Rata-rata Kumulatif
          </span>
          {viewMode === 'chronological' && (
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block mr-1.5"></span>
              Titik Biru: Nilai Per Guru
            </span>
          )}
          <span className="flex items-center">
            <span className="w-4 h-0.5 border-t border-dashed border-emerald-500 inline-block mr-1.5"></span>
            Garis Putus: Target Minimal Baik (80)
          </span>
        </div>
        <span className="italic text-slate-400">
          Data diperbarui secara otomatis dari modul observasi
        </span>
      </div>
    </div>
  );
};
