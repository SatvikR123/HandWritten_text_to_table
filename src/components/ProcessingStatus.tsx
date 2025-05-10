import React from 'react';

interface ProcessingStatusProps {
  progress: number;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ progress }) => {
  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">Processing</span>
        <span className="text-slate-500">{progress}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">
        {progress < 100 
          ? 'Extracting data from your files...' 
          : 'Processing complete!'}
      </p>
    </div>
  );
};

export default ProcessingStatus;