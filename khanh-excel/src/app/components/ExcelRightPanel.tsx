import React from 'react';
import ExcelFileUpload from './ExcelFileUpload';
import ExcelDataSummary from './ExcelDataSummary';
import { ExcelData } from '../types/excel';

interface ExcelRightPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  sheetIndex: number;
  availableSheets: string[];
  onSheetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  excelData: ExcelData | null;
  onExportJSON: () => void;
}

export default function ExcelRightPanel({
  isVisible,
  onToggle,
  sheetIndex,
  availableSheets,
  onSheetChange,
  onFileUpload,
  isLoading,
  excelData,
  onExportJSON
}: ExcelRightPanelProps) {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg
          className={`w-6 h-6 text-gray-600 transform transition-transform ${isVisible ? 'rotate-0' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Docked Right Panel */}
      <div
        className={`fixed top-0 right-0 w-80 h-screen bg-white shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Upload Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Upload Excel File</h2>
            <ExcelFileUpload
              sheetIndex={sheetIndex}
              availableSheets={availableSheets}
              onSheetChange={onSheetChange}
              onFileUpload={onFileUpload}
              isLoading={isLoading}
            />
          </div>
          
          {/* Summary Section */}
          {excelData && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h2 className="text-lg font-semibold text-blue-700 mb-4">Data Summary</h2>
              <ExcelDataSummary
                data={excelData}
                onExportJSON={onExportJSON}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
} 