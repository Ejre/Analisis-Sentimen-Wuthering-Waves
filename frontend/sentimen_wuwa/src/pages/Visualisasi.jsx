import wordcloudPositive from "../assets/wordcloud-positive.png";
import wordcloudNegative from "../assets/wordcloud-negative.png";
import confusionMatrix from "../assets/Confusion-matrix.png";

const ImageCard = ({ title, src, alt }) => (
  <div className="glass-panel p-4 rounded-xl group hover:bg-slate-800/80 transition-all duration-300">
    <h4 className="text-cyan-400 font-medium mb-3 border-l-2 border-cyan-500 pl-2">{title}</h4>
    <div className="overflow-hidden rounded-lg border border-slate-700/50">
      <img
        src={src}
        alt={alt}
        className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
      />
    </div>
  </div>
);

export default function Visualisasi() {
  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white font-tech tracking-tight mb-2">
          Visualisasi <span className="text-cyan-400">Data</span>
        </h2>
        <p className="text-slate-400">
          Representasi visual dari distribusi kata (Word Cloud) dan performa klasifikasi model.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-amber-400 rounded-full"></span>
          Word Clouds
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageCard title="Sentimen Positif" src={wordcloudPositive} alt="Word Cloud Positif" />
          <ImageCard title="Sentimen Negatif" src={wordcloudNegative} alt="Word Cloud Negatif" />
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
          Confusion Matrix Evaluasi
        </h3>
        <div className="flex justify-center bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <div className="w-full max-w-2xl">
            <img
              src={confusionMatrix}
              alt="Confusion Matrix"
              className="w-full rounded-lg shadow-2xl opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
