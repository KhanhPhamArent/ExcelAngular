import React from 'react';
import { ExcelData } from '../types/excel';

interface ExcelLeftPanelProps {
  showSections: boolean;
  onToggleSections: () => void;
  sections: any[];
  excelData: ExcelData | null;
}

export default function ExcelLeftPanel({
  showSections,
  onToggleSections,
  sections,
  excelData
}: ExcelLeftPanelProps) {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-slate-800 dark:bg-slate-900 p-4 border-r border-slate-700 z-10">
      <div className="space-y-4">
        <button
          onClick={onToggleSections}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            showSections 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
          }`}
        >
          {showSections ? 'Hide Sections' : 'Show Sections'}
        </button>
        
        {sections.length > 0 && (
          <div className="mt-4 text-slate-300 text-sm">
            <p>Total Sections: {sections.length}</p>
            <p>Total Rows: {excelData?.metadata.totalRows || 0}</p>
          </div>
        )}
      </div>
    </div>
  );
} 