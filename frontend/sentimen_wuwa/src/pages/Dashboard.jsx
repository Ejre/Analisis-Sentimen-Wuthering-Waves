import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Activity, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Positif', value: 2153, color: '#4ade80' }, // Green-400
  { name: 'Negatif', value: 1588, color: '#f43f5e' }, // Rose-500
];

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 ${color}`}>
      <Icon size={80} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg bg-slate-800 ${color} bg-opacity-20`}>
          <Icon size={20} className={color.replace('bg-', 'text-')} />
        </div>
        <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider">{title}</h3>
      </div>
      <p className="text-4xl font-bold text-white font-tech mb-1">{value}</p>
      <p className="text-slate-500 text-xs">{subtext}</p>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-bold text-white font-tech tracking-tight">
            Dashboard <span className="text-cyan-400">Sentimen</span>
          </h2>
          <p className="text-slate-400 mt-2 max-w-xl">
            Analisis real-time performa model Random Forest (Optimized) pada dataset ulasan Wuthering Waves.
          </p>
        </div>
        <div className="px-4 py-2 bg-cyan-900/30 border border-cyan-500/30 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
          <span className="text-cyan-300 text-xs font-mono uppercase">Model v2.1 Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Akurasi Model"
          value="95.08%"
          subtext="Meningkat dari 83% (Baseline)"
          icon={Activity}
          color="text-cyan-400"
        />
        <StatCard
          title="Total Data"
          value="3,741"
          subtext="+300 Ulasan Sintetis"
          icon={TrendingUp}
          color="text-amber-400"
        />
        <StatCard
          title="Sentimen Positif"
          value="2,153"
          subtext="57.5% dari total ulasan"
          icon={CheckCircle}
          color="text-green-400"
        />
        <StatCard
          title="Sentimen Negatif"
          value="1,588"
          subtext="42.5% dari total ulasan"
          icon={AlertTriangle}
          color="text-rose-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
            Distribusi Kelas
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#fff" width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: '#1e293b' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info / Context Panel */}
        <div className="glass-panel p-6 rounded-2xl relative">
          <h3 className="text-xl font-bold text-white mb-4">Insight Model</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/50 border-l-4 border-cyan-500">
              <h4 className="text-cyan-400 font-medium mb-1">Random Forest + SMOTE</h4>
              <p className="text-slate-400 text-sm">
                Model menggunakan teknik oversampling SMOTE untuk menyeimbangkan kelas negatif, menghasilkan F1-Score yang lebih tinggi.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border-l-4 border-amber-500">
              <h4 className="text-amber-400 font-medium mb-1">Top Keywords</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Grafik', 'Cerita', 'Gacha', 'Lag', 'F2P'].map(kw => (
                  <span key={kw} className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300 border border-slate-600">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative element */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
    </div>
  );
}
