import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import AppInput from '../../common/AppInput';
import AppButton from '../../common/AppButton';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.string().min(1, 'Type is required'),
  courseId: z.coerce.string().optional(),
  url: z.string().optional(),
  fileName: z.string().optional(),
  visibleToStudents: z.boolean().optional(),
});

const sel = "w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/40";

const MaterialForm = ({ defaultValues, onSubmit, loading, isEdit, courses }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileBase64, setFileBase64] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { title: '', description: '', type: '', courseId: '', url: '', visibleToStudents: true },
  });

  const materialType = watch('type');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('File too large! Max 50MB');
      return;
    }

    setSelectedFile(file);
    setValue('fileName', file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result);
      setValue('url', reader.result); // Store base64 in url field for now
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      courseId: data.courseId ? parseInt(data.courseId) : null,
      // If it's a file type, use the base64 data as the URL
      url: ['pdf', 'audio', 'image', 'doc'].includes(data.type) ? fileBase64 || data.url : data.url,
    };
    onSubmit(payload);
  };

  // Check if type needs file upload
  const isFileType = ['pdf', 'audio', 'image', 'doc'].includes(materialType);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <AppInput label="Title" placeholder="Material title" required error={errors.title?.message} {...register('title')} />
      <AppInput label="Description" placeholder="Brief description" error={errors.description?.message} {...register('description')} />
      
      <div className="grid grid-cols-2 gap-3">
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Type *</label>
          <select {...register('type')} className={`${sel} ${errors.type ? '!border-red-500' : ''}`}>
            <option value="">Select type</option>
            <option value="pdf">📄 PDF Document</option>
            <option value="video">🎥 Video (YouTube/Link)</option>
            <option value="audio">🎵 Audio File</option>
            <option value="image">🖼️ Image</option>
            <option value="link">🔗 External Link</option>
            <option value="doc">📝 Word Document</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Course</label>
          <select {...register('courseId')} className={sel}>
            <option value="">Select course</option>
            {(courses || []).map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {isFileType ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">
            Upload File {['pdf', 'audio', 'image', 'doc'].includes(materialType) && `(${materialType.toUpperCase()})`} *
          </label>
          <input
            type="file"
            accept={
              materialType === 'pdf' ? '.pdf' :
              materialType === 'audio' ? '.mp3,.wav,.ogg' :
              materialType === 'image' ? '.jpg,.jpeg,.png,.webp' :
              materialType === 'doc' ? '.doc,.docx' : '*'
            }
            onChange={handleFileChange}
            className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm focus:ring-2 focus:ring-[#00B4D8]/40 outline-none h-11 flex items-center bg-white"
          />
          {(selectedFile || (isEdit && defaultValues?.fileName)) && (
            <p className="text-xs text-green-600 mt-1">
              ✅ {selectedFile ? selectedFile.name : defaultValues.fileName}
            </p>
          )}
        </div>
      ) : (
        <AppInput 
          label={materialType === 'video' ? "Video URL" : "Link URL"} 
          placeholder="https://..." 
          error={errors.url?.message} 
          {...register('url')} 
        />
      )}

      <label className="flex items-center gap-2 text-sm text-[#4A5568] mb-4 cursor-pointer">
        <input type="checkbox" {...register('visibleToStudents')} className="w-4 h-4 rounded border-[#E2E8F0] text-[#00B4D8]" />
        Visible to students
      </label>

      <div className="flex justify-end gap-3 mt-6">
        <AppButton type="submit" variant="primary" loading={loading}>{isEdit ? 'Update' : 'Add Material'}</AppButton>
      </div>
    </form>
  );
};

export default MaterialForm;
