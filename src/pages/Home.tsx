import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProcessingStatus from '../components/ProcessingStatus';
import ResultPreview from '../components/ResultPreview';
import { FileWithPreview } from '../types';
import { extractTableFromImage } from '../utils/gemini';

const Home: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFilesAdded = (newFiles: FileWithPreview[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const handleFileRemove = (fileToRemove: FileWithPreview) => {
    setFiles(files.filter(file => file !== fileToRemove));
    if (results.length > 0) {
      setResults(results.filter(result => result.filename !== fileToRemove.name));
    }
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) {
      setError("Please add at least one file to process");
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setResults([]);
    setError(null);

    try {
      const processedResults = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = await extractTableFromImage(file);
        
        processedResults.push({
          filename: file.name,
          data
        });
        
        const progress = Math.round(((i + 1) / files.length) * 100);
        setProcessingProgress(progress);
      }
      
      setResults(processedResults);
    } catch (err) {
      setError(`Processing failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(100);
    }
  };

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Convert Handwritten Text to Excel</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload images or PDFs containing handwritten text, tables, or forms. 
          Our AI will automatically extract the data and convert it to Excel format.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <FileUploader 
            files={files}
            onFilesAdded={handleFilesAdded}
            onFileRemove={handleFileRemove}
            isProcessing={isProcessing}
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleProcessFiles}
              disabled={isProcessing || files.length === 0}
              className={`px-6 py-3 rounded-lg font-medium text-white ${
                isProcessing || files.length === 0
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              } transition-colors shadow-sm`}
            >
              {isProcessing ? 'Processing...' : 'Process Files'}
            </button>
          </div>

          {isProcessing && (
            <ProcessingStatus progress={processingProgress} />
          )}
        </section>

        <section>
          <ResultPreview 
            results={results} 
            isProcessing={isProcessing} 
          />
        </section>
      </div>
    </div>
  );
};

export default Home;