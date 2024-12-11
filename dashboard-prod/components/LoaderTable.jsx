const LoaderTable = ({textColor = 'text-sky-900', borderColor = 'border-sky-700'}) => { 
  return (
    <div className="flex flex-col items-center justify-center h-[40vh]">
      <div className={`w-16 h-16 border-8 ${borderColor} border-dashed rounded-full animate-spin`}></div>
      <div className={`py-8 ${textColor}`}>Chargement en cours...</div>
    </div>
    );
};

export default LoaderTable;