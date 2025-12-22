import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import InputSentimen from "./pages/InputSentimen";
import Visualisasi from "./pages/Visualisasi";
import Dashboard from "./pages/Dashboard";
import './index.css';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[url('https://images7.alphacoders.com/135/1352932.jpeg')] bg-cover bg-fixed bg-center">
        {/* Overlay agar text terbaca jelas di atas background */}
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-0"></div>

        {/* Sidebar kiri */}
        <Sidebar />

        {/* Area konten kanan */}
        <div className="flex-1 flex flex-col ml-64 relative z-10">
          {/* Main Content */}
          <main className="flex-1 p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/visualisasi" element={<Visualisasi />} />
              <Route path="/input" element={<InputSentimen />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
