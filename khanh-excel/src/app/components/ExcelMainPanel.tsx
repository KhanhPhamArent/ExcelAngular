'use client';

import { useState } from 'react';
import ExcelSection from './ExcelSection';
import DuplicateEntriesResults from './DuplicateEntriesResults';
import SalaryResults from './SalaryResults';
import { ExcelData, Section } from './types';
import { ContentType } from './ExcelLeftPanel';

interface ExcelMainPanelProps {
  isLoading: boolean;
  error: string | null;
  sections: Section[];
  activeContentType: ContentType;
  analysisResults: {
    key: string;
    column: string;
    sections: string[];
  }[];
  isPanelVisible: boolean;
  onToggleSection: (sectionIndex: number) => void;
}

export default function ExcelMainPanel({
  isLoading,
  error,
  sections,
  activeContentType,
  analysisResults,
  isPanelVisible,
  onToggleSection
}: ExcelMainPanelProps) {
  return (
    <div className="flex-1 overflow-auto ml-64 w-full">
      <div className={`w-full h-full p-8 ${isPanelVisible ? "pr-80" : ""}`}>
        <div className="max-w-[1200px] mx-auto">
          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
              <p className="mt-2 text-sm text-slate-400">Processing file...</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 bg-red-900/50 text-red-200 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {/* Conditional rendering based on active content type */}
          {activeContentType === ContentType.DUPLICATES && (
            <DuplicateEntriesResults results={analysisResults} />
          )}
          
          {activeContentType === ContentType.SALARY && (
            <SalaryResults results={analysisResults} />
          )}
          
          {activeContentType === ContentType.SECTIONS && sections.length > 0 && (
            <div className="space-y-8">
              {sections.map((section, sectionIndex) => (
                <ExcelSection
                  key={sectionIndex}
                  section={section}
                  onToggle={() => onToggleSection(sectionIndex)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 