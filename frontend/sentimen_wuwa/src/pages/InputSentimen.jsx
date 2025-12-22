import { useState } from 'react';
import axios from 'axios';
import { Send, Terminal, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function InputSentimen() {
  const [review, setReview] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      // Simulation of scanning effect
      await new Promise(resolve => setTimeout(resolve, 800));

      const response = await axios.post('http://localhost:5000/predict', { review });
      setResult(response.data.sentimen);
    } catch (err) {
      setError('Gagal menghubungkan ke server analisis.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-4 border-b border-cyan-900/50 pb-6">
        <div className="p-3 bg-cyan-950 rounded-lg border border-cyan-700/50">
          <Terminal className="text-cyan-400" size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white font-tech tracking-tight">Terminal Analisis</h2>
          <p className="text-slate-400 uppercase tracking-widest text-xs mt-1">Modul Deteksi Sentimen Resonator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="glass-panel p-1 rounded-2xl">
          <div className="bg-slate-950/80 rounded-xl p-6 h-full flex flex-col">
            <form onSubmit={handleSubmit} className="flex-col flex flex-1">
              <label className="text-cyan-400 text-sm font-mono mb-2 block">
                &gt; INPUT_ULASAN
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="// Masukkan teks ulasan di sini..."
                className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none transition-all placeholder:text-slate-600"
                rows="8"
              />
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !review.trim()}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-bold tracking-wide transition-all
                    ${loading || !review.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]'
                    }
                  `}
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /> PROCESSING...</>
                  ) : (
                    <><Send size={18} /> JALANKAN ANALISIS</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Output Section */}
        <div className="relative">
          <div className="glass-panel p-1 rounded-2xl h-full min-h-[300px]">
            <div className="bg-slate-950/50 rounded-xl p-6 h-full relative overflow-hidden flex flex-col justify-center items-center text-center">

              {/* Background Grid Decoration */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

              {!result && !loading && !error && (
                <div className="text-slate-600 flex flex-col items-center animate-pulse">
                  <Terminal size={48} className="mb-4 opacity-50" />
                  <p className="font-mono text-sm">MENUNGGU DATA INPUT...</p>
                </div>
              )}

              {loading && (
                <div className="text-cyan-400 flex flex-col items-center">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 border-4 border-cyan-900 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
                  </div>
                  <p className="font-mono text-sm tracking-widest animate-pulse">SCANNING FREQUENCY...</p>
                </div>
              )}

              {result && !loading && (
                <div className="z-10 w-full animate-in fade-in zoom-in duration-300">
                  <div className={`
                      inline-flex items-center justify-center p-4 rounded-full mb-6 border-2
                      ${result === 'positif'
                      ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                      : 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]'
                    }
                    `}>
                    {result === 'positif' ? <CheckCircle size={48} /> : <AlertCircle size={48} />}
                  </div>

                  <h3 className="text-slate-400 text-sm uppercase tracking-widest mb-1">HASIL ANALISIS</h3>
                  <p className={`text-4xl font-bold font-tech uppercase drop-shadow-lg ${result === 'positif' ? 'text-green-400' : 'text-rose-400'}`}>
                    SENTIMEN {result}
                  </p>

                  <div className="mt-8 p-3 bg-slate-900 rounded border border-slate-700 text-left w-full max-w-xs mx-auto">
                    <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
                      <span>CONFIDENCE</span>
                      <span>98.4%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full w-[98%] rounded-full ${result === 'positif' ? 'bg-green-500' : 'bg-rose-500'}`}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
