import AppButton from '../../common/AppButton';
import AppBadge from '../../common/AppBadge';
import { formatDate } from '../../../utils/formatDate';
import GridSkeleton from '../../common/GridSkeleton';

const typeIcons = { PDF: '📄', Video: '🎬', Audio: '🎵', Link: '🔗' };

const RecentMaterials = ({ materials, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
    <div className="p-5 border-b border-[#E2E8F0]">
      <h3 className="text-base font-semibold text-[#1A1A2E]">Recent Materials</h3>
    </div>
    <div className="p-4">
      {loading ? (
        <GridSkeleton items={4} />
      ) : (!materials || materials.length === 0) ? (
        <div className="text-center p-8 text-sm text-[#4A5568]">No materials shared yet</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {materials.slice(0, 4).map((m, i) => (
            <div key={i} className="border border-[#E2E8F0] rounded-xl p-4 hover:shadow-md transition-shadow">
              <span className="text-2xl block mb-2">{typeIcons[m.type] || '📄'}</span>
              <h4 className="text-sm font-medium text-[#1A1A2E] truncate mb-1">{m.title}</h4>
              <div className="flex items-center gap-2 mb-2">
                <AppBadge status={m.type || 'PDF'} />
              </div>
              <p className="text-xs text-[#4A5568] mb-3">{formatDate(m.createdAt)}</p>
              {m.url && (
                <a href={m.url} target="_blank" rel="noopener noreferrer">
                  <AppButton variant="outline" size="sm" fullWidth>Download</AppButton>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default RecentMaterials;
