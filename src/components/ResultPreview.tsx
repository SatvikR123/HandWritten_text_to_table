import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface ResultPreviewProps {
  results: any[];
  isProcessing: boolean;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ results, isProcessing }) => {
  const handleDownloadExcel = (result: any) => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(result.data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Save the file
    saveAs(fileData, `${result.filename.split('.')[0]}.xlsx`);
  };

  if (isProcessing) {
    return (
      <div className="border border-slate-200 rounded-lg bg-white p-8 h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-center space-y-4">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="text-slate-600">Processing your files...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="border border-slate-200 rounded-lg bg-white p-8 h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-slate-600">Upload and process files to see results here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg bg-white p-4 overflow-hidden">
      <div className="space-y-6">
        {results.map((result, resultIndex) => (
          <div key={`result-${resultIndex}`} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-800 truncate">{result.filename}</h3>
              <button
                onClick={() => handleDownloadExcel(result)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Download Excel</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {result.data[0].map((header: string, headerIndex: number) => (
                      <th 
                        key={`header-${resultIndex}-${headerIndex}`}
                        className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {result.data.slice(1).map((row: string[], rowIndex: number) => (
                    <tr key={`row-${resultIndex}-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td 
                          key={`cell-${resultIndex}-${rowIndex}-${cellIndex}`}
                          className="px-4 py-3 text-sm text-slate-700"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPreview;