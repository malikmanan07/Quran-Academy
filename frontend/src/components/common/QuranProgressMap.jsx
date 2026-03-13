const PARAS = [
  { num: 1, arabic: 'الم', english: 'Alif Lam Meem' },
  { num: 2, arabic: 'سَيَقُولُ', english: 'Sayaqool' },
  { num: 3, arabic: 'تِلْكَ الرُّسُلُ', english: 'Tilkal Rusul' },
  { num: 4, arabic: 'لَن تَنَالُوا', english: 'Lan Tana Loo' },
  { num: 5, arabic: 'وَالْمُحْصَنَاتُ', english: 'Wal Muhsanat' },
  { num: 6, arabic: 'لَا يُحِبُّ اللَّهُ', english: 'La Yuhibbullah' },
  { num: 7, arabic: 'وَإِذَا سَمِعُوا', english: 'Wa Iza Samioo' },
  { num: 8, arabic: 'وَلَوْ أَنَّنَا', english: 'Wa Lau Annana' },
  { num: 9, arabic: 'قَالَ الْمَلَأُ', english: 'Qalal Malao' },
  { num: 10, arabic: 'وَاعْلَمُوا', english: 'Wa Aalamoo' },
  { num: 11, arabic: 'يَعْتَذِرُونَ', english: 'Yatazeroon' },
  { num: 12, arabic: 'وَمَا مِن دَابَّةٍ', english: 'Wa Ma Min Dabbah' },
  { num: 13, arabic: 'وَمَا أُبَرِّئُ', english: 'Wa Ma Ubarrio' },
  { num: 14, arabic: 'رُبَمَا', english: 'Rubama' },
  { num: 15, arabic: 'سُبْحَانَ الَّذِي', english: 'Subhanallazi' },
  { num: 16, arabic: 'قَالَ أَلَمْ', english: 'Qal Alam' },
  { num: 17, arabic: 'اقْتَرَبَ', english: 'Iqtaraba' },
  { num: 18, arabic: 'قَدْ أَفْلَحَ', english: 'Qad Aflaha' },
  { num: 19, arabic: 'وَقَالَ الَّذِينَ', english: 'Wa Qalallazina' },
  { num: 20, arabic: 'أَمَّنْ خَلَقَ', english: 'Amman Khalaq' },
  { num: 21, arabic: 'اتْلُ مَا أُوحِيَ', english: 'Utlu Ma Oohiya' },
  { num: 22, arabic: 'وَمَن يَقْنُتْ', english: 'Wa Man Yaqnut' },
  { num: 23, arabic: 'وَمَالِيَ', english: 'Wa Mali' },
  { num: 24, arabic: 'فَمَنْ أَظْلَمُ', english: 'Faman Azlam' },
  { num: 25, arabic: 'إِلَيْهِ يُرَدُّ', english: 'Elahe Yuraddu' },
  { num: 26, arabic: 'حم', english: 'Ha Meem' },
  { num: 27, arabic: 'قَالَ فَمَا خَطْبُكُمْ', english: 'Qala Fama Khatbukum' },
  { num: 28, arabic: 'قَدْ سَمِعَ اللَّهُ', english: 'Qad Sami Allah' },
  { num: 29, arabic: 'تَبَارَكَ الَّذِي', english: 'Tabarakallazi' },
  { num: 30, arabic: 'عَمَّ', english: 'Amma' },
];

const statusColors = {
  completed: 'bg-[#1B4332] text-white border-[#1B4332]',
  'in-progress': 'bg-[#00B4D8]/15 text-[#00B4D8] border-[#00B4D8]',
  'not-started': 'bg-gray-50 text-[#4A5568] border-[#E2E8F0]',
};

const statusLabels = { completed: 'Completed', 'in-progress': 'In Progress', 'not-started': 'Not Started' };

const QuranProgressMap = ({ progress = [], onUpdatePara, mini = false, editable = false }) => {
  const getStatus = (num) => {
    const p = progress.find(x => x.paraNumber === num);
    return p?.status || 'not-started';
  };

  const completed = progress.filter(p => p.status === 'completed').length;
  const pct = Math.round((completed / 30) * 100);
  const displayParas = mini ? PARAS.slice(0, 10) : PARAS;

  const cycleStatus = (num) => {
    if (!editable || !onUpdatePara) return;
    const current = getStatus(num);
    const next = current === 'not-started' ? 'in-progress' : current === 'in-progress' ? 'completed' : 'not-started';
    onUpdatePara(num, next);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 sm:p-6">
      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[#1A1A2E]">📖 Quran Progress</h3>
          <span className="text-xs font-semibold text-[#00B4D8]">{completed}/30 Paras — {pct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-[#1B4332] to-[#00B4D8] h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(statusLabels).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5 text-xs text-[#4A5568]">
            <span className={`w-3 h-3 rounded-sm border ${statusColors[k]}`} />
            {v}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={`grid gap-2 ${mini ? 'grid-cols-5' : 'grid-cols-3 sm:grid-cols-5'}`}>
        {displayParas.map(para => {
          const status = getStatus(para.num);
          return (
            <button
              key={para.num}
              onClick={() => cycleStatus(para.num)}
              disabled={!editable}
              title={`Para ${para.num}: ${para.english} — ${statusLabels[status]}`}
              className={`relative flex flex-col items-center p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 ${statusColors[status]} ${
                editable ? 'cursor-pointer hover:scale-105 hover:shadow-md' : 'cursor-default'
              }`}
            >
              <span className="text-xs font-bold">{para.num}</span>
              <span className="text-[10px] sm:text-xs mt-0.5 font-medium truncate w-full text-center" dir="rtl">{para.arabic}</span>
              {!mini && <span className="text-[9px] mt-0.5 opacity-70 truncate w-full text-center">{para.english}</span>}
            </button>
          );
        })}
      </div>
      {mini && <p className="mt-3 text-xs text-[#4A5568] text-center">Showing first 10 paras</p>}
    </div>
  );
};

export default QuranProgressMap;
