import React, { useState } from 'react';
import { Section } from '../types/excel';
import ExcelTable from './ExcelTable';
import Modal from './Modal';

interface ExcelSectionProps {
  section: Section;
  onToggle: () => void;
}

export default function ExcelSection({ section, onToggle }: ExcelSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    link.download = `Row_${section.rows[0]?.stt}_data.csv`;
    link.click();
  };

  const sectionName = section.title || 'Empty Section';

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-200 hover:shadow-lg">
        <div 
          className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {sectionName}
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex flex-col">
            <div 
              className="relative flex-1 bg-white overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-white">
                <h3 className="text-lg font-medium text-gray-900">{sectionName}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-4">
                <div className="h-full">
                  <ExcelTable 
                    rows={section.rows} 
                    onExportCSV={handleExportCSV}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 