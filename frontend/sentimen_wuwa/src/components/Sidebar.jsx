import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Activity, MessageSquare, Terminal } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/visualisasi", label: "Visualisasi", icon: <Activity size={20} /> },
    { path: "/input", label: "Terminal Analisis", icon: <Terminal size={20} /> },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl z-50 flex flex-col">
      {/* Brand */}
      {/* Brand */}
      <div className="h-24 flex flex-row items-center justify-center gap-3 border-b border-slate-700/50 px-6">
        <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-amber-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex-shrink-0">
          <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden flex items-center justify-center">
            <img
              src="/assets/logo.png"
              alt="WuWa Sentiment"
              className="w-[120%] h-[120%] object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-cyan-400 tracking-[0.1em] font-tech leading-none">WUWA</h1>
          <h2 className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mt-1">Sentiment</h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group
                ${isActive
                  ? "bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "text-slate-400 hover:text-cyan-300 hover:bg-white/5"
                }
              `}
            >
              <div className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                {item.icon}
              </div>
              <span className="font-medium tracking-wide">{item.label}</span>

              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm text-green-400 font-mono">System Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
