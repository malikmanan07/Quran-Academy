const FormSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-10 bg-gray-100 rounded w-full" />
        </div>
      ))}
      <div className="h-12 bg-gray-200 rounded w-full mt-6" />
    </div>
  );
};

export default FormSkeleton;
