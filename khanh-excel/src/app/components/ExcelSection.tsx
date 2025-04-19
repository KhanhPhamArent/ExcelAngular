import React from 'react';
import { Section } from '../types/excel';
import ExcelTable from './ExcelTable';

interface ExcelSectionProps {
  section: Section;
  onToggle: () => void;
}

export default function ExcelSection({ section, onToggle }: ExcelSectionProps) {
  const handleExportCSV = (e: React.MouseEvent) => {
    e.stopPropagation();
    const csvContent = section.rows.map(row => {
      const values = [row.stt, row.key];
      for (let i = 3; i <= 51; i++) {
        values.push(row[`col${i}`]?.toString() ?? '');
      }
      return values.join(',');
    }).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${section.title}_data.csv`;
    link.click();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-200 hover:shadow-lg">
      <div 
        className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <svg
              className={`w-5 h-5 text-blue-600 dark:text-blue-400 transform transition-transform duration-200 ${section.isCollapsed ? '-rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {section.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {section.rows.length} rows
            </p>
          </div>
        </div>
        <button
          onClick={(e) => handleExportCSV(e)}
          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          Export CSV
        </button>
      </div>
      <div 
        className={`transition-all duration-300 ease-in-out ${
          section.isCollapsed 
            ? 'max-h-0 opacity-0' 
            : 'max-h-[2000px] opacity-100'
        }`}
      >
        <div className="p-4">
          <ExcelTable 
            rows={section.rows} 
            onExportCSV={handleExportCSV}
          />
        </div>
      </div>
    </div>
  );
} 