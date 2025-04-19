import React, { useState, useCallback } from 'react';

interface ExcelFileUploadProps {
  sheetIndex: number;
  availableSheets: string[];
  onSheetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export default function ExcelFileUpload({
  sheetIndex,
  availableSheets,
  onSheetChange,
  onFileUpload,
  isLoading
}: ExcelFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handlePrevSheet = () => {
    if (sheetIndex > 0) {
      const event = { target: { value: (sheetIndex - 1).toString() } } as React.ChangeEvent<HTMLInputElement>;
      onSheetChange(event);
    }
  };

  const handleNextSheet = () => {
    if (sheetIndex < availableSheets.length - 1) {
      const event = { target: { value: (sheetIndex + 1).toString() } } as React.ChangeEvent<HTMLInputElement>;
      onSheetChange(event);
    }
  };

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
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel') {
        const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
        onFileUpload(event);
      }
    }
  }, [onFileUpload]);

  return (
    <div className="space-y-4">
      <div 
        className={`flex flex-col space-y-2 border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="text-sm font-medium text-gray-700">
          Upload Excel File
        </label>
        <div className="flex flex-col items-center justify-center space-y-2">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={onFileUpload}
            disabled={isLoading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-sm text-gray-500">
            or drag and drop your Excel file here
          </p>
        </div>
      </div>

      {availableSheets.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Sheet Selection
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevSheet}
              disabled={sheetIndex === 0 || isLoading}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <div className="flex-1 text-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
              {availableSheets[sheetIndex] || 'None'}
            </div>
            <button
              onClick={handleNextSheet}
              disabled={sheetIndex === availableSheets.length - 1 || isLoading}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 