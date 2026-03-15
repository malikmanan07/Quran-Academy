export default function PageSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-fade-in">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}
