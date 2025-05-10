import React, { useCallback, useState } from 'react';
import { FileUp as FileUpload, X, File as FileIcon, Image as ImageIcon } from 'lucide-react';
import { FileWithPreview } from '../types';

interface FileUploaderProps {
  files: FileWithPreview[];
  onFilesAdded: (files: FileWithPreview[]) => void;
  onFileRemove: (file: FileWithPreview) => void;
  isProcessing: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  files, 
  onFilesAdded, 
  onFileRemove,
  isProcessing 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer && !isProcessing) {
      const newFiles = processDraggedFiles(e.dataTransfer.files);
      if (newFiles.length > 0) {
        onFilesAdded(newFiles);
      }
    }
  }, [onFilesAdded, isProcessing]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && !isProcessing) {
      const newFiles = processDraggedFiles(e.target.files);
      if (newFiles.length > 0) {
        onFilesAdded(newFiles);
      }
    }
  }, [onFilesAdded, isProcessing]);

  const processDraggedFiles = (fileList: FileList): FileWithPreview[] => {
    const validFiles: FileWithPreview[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fileType = file.type;
      
      // Check if the file is PDF or image
      if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        validFiles.push(Object.assign(file, { preview }));
      }
    }
    
    return validFiles;
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-slate-300 hover:border-blue-400'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !isProcessing && document.getElementById('file-input')?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <FileUpload className="h-12 w-12 text-blue-500" />
          <div>
            <p className="text-lg font-medium text-slate-800">
              Drag & drop files here, or click to browse
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Supported formats: PDF, JPEG, PNG
            </p>
          </div>
          <input 
            id="file-input"
            type="file" 
            multiple 
            accept=".pdf,image/*" 
            className="hidden"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Uploaded files:</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
              >
                <div className="flex items-center space-x-3 truncate">
                  {file.type === 'application/pdf' ? (
                    <FileIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-blue-500" />
                  )}
                  <span className="text-sm text-slate-700 truncate">{file.name}</span>
                </div>
                <button 
                  onClick={() => onFileRemove(file)}
                  disabled={isProcessing}
                  className={`text-slate-400 hover:text-red-500 transition-colors ${
                    isProcessing ? 'cursor-not-allowed' : ''
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;