import AppBadge from '../../common/AppBadge';
import AppButton from '../../common/AppButton';
import { formatDate } from '../../../utils/formatDate';

const typeIcons = { 
  pdf: '📄', 
  video: '🎬', 
  audio: '🎵', 
  link: '🔗',
  image: '🖼️',
  doc: '📝'
};

const MaterialCard = ({ material, onEdit, onDelete }) => {
  const isDownloadable = ['pdf', 'audio', 'image', 'doc'].includes(material.type?.toLowerCase());
  const displayType = (material.type || 'pdf').toLowerCase();

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
      <div className="bg-gradient-to-br from-[#1B3A5C] to-[#1B4332] p-6 text-center">
        <span className="text-4xl group-hover:scale-110 transition-transform inline-block">
          {typeIcons[displayType] || '📄'}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-[#1A1A2E] mb-1 truncate" title={material.title}>{material.title}</h3>
        <p className="text-xs text-[#4A5568] mb-2 line-clamp-2 flex-1">{material.description || 'No description'}</p>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <AppBadge status={material.type || 'pdf'} label={material.type?.toUpperCase()} />
          {material.courseName && <span className="text-xs text-[#4A5568] bg-[#F0F4F8] px-2 py-0.5 rounded-full">{material.courseName}</span>}
        </div>
        <p className="text-xs text-[#4A5568] mb-3">{formatDate(material.createdAt)}</p>
        
        {material.url && (
          <div className="mb-3">
            <a 
              href={material.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              download={isDownloadable ? (material.fileName || material.title) : undefined}
            >
              <AppButton variant="accent" size="sm" fullWidth>
                {isDownloadable ? 'Download / View' : 'Visit Link'}
              </AppButton>
            </a>
          </div>
        )}
        
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && <AppButton variant="outline" size="sm" className="flex-1" onClick={() => onEdit(material)}>Edit</AppButton>}
            {onDelete && <AppButton variant="danger" size="sm" className="flex-1 text-red-500 hover:text-white" onClick={() => onDelete(material)}>Delete</AppButton>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialCard;
