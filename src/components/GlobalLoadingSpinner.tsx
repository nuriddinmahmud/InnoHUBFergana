const GlobalLoadingSpinner = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0A0A0A]">
      <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#22C55E]/30 border-t-[#22C55E]" />
    </div>
  );
};

export default GlobalLoadingSpinner;
