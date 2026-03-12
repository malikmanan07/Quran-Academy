import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';
import { formatDate } from '../../../utils/formatDate';

const typeIcons = { PDF: '📄', Video: '🎬', Audio: '🎵', Link: '🔗' };

const MaterialCard = ({ material, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
    <div className="bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] p-6 text-center">
      <span className="text-4xl group-hover:scale-110 transition-transform inline-block">
        {typeIcons[material.type] || '📄'}
      </span>
    </div>
    <div className="p-4 flex flex-col flex-1">
      <h3 className="text-sm font-semibold text-[#1A1A2E] mb-1 truncate">{material.title}</h3>
      <p className="text-xs text-[#4A5568] mb-2 line-clamp-2 flex-1">{material.description || 'No description'}</p>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <AppBadge status={material.type || 'PDF'} />
        {material.courseName && <span className="text-xs text-[#4A5568] bg-[#F0F4F8] px-2 py-0.5 rounded-full">{material.courseName}</span>}
      </div>
      <p className="text-xs text-[#4A5568] mb-3">{formatDate(material.createdAt)}</p>
      {material.url && (
        <a href={material.url} target="_blank" rel="noopener noreferrer" className="mb-3">
          <AppButton variant="accent" size="sm" fullWidth>View / Download</AppButton>
        </a>
      )}
      <div className="flex gap-2">
        <AppButton variant="outline" size="sm" fullWidth onClick={() => onEdit(material)}>Edit</AppButton>
        <AppButton variant="danger" size="sm" fullWidth onClick={() => onDelete(material)}>Delete</AppButton>
      </div>
    </div>
  </div>
);

export default MaterialCard;
