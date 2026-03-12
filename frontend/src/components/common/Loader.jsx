const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F0F4F8]/80">
      <div className="w-12 h-12 border-4 border-[#E2E8F0] border-t-[#1B3A5C] rounded-full animate-spin" />
      <p className="mt-4 text-sm font-medium text-[#4A5568]">{text}</p>
    </div>
  );
};

export default Loader;
