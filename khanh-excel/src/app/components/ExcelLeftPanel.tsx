import React from 'react';
import { ExcelData, Section } from '../types/excel';

// Define content types as an enum for better type safety
export enum ContentType {
  SECTIONS = 'sections',
  DUPLICATES = 'duplicates',
  // Add more content types here in the future
}

interface ExcelLeftPanelProps {
  activeContentType: ContentType;
  onContentTypeChange: (contentType: ContentType) => void;
  sections: Section[];
  excelData: ExcelData | null;
  onAnalyzeData: (results: {
    key: string;
    column: string;
    sections: string[];
  }[]) => void;
}

export default function ExcelLeftPanel({
  activeContentType,
  onContentTypeChange,
  sections,
  excelData,
  onAnalyzeData
}: ExcelLeftPanelProps) {
  const findDuplicateEntriesAcrossSections = () => {
    if (!excelData || sections.length === 0) return;

    // Get all rows from all sections
    const allRows = sections.flatMap(section => 
      section.rows.map(row => ({
        ...row,
        sectionTitle: section.title
      }))
    );

    // Group by key
    const groupedByKey: Record<string, any[]> = {};
    allRows.forEach(row => {
      if (!groupedByKey[row.key]) {
        groupedByKey[row.key] = [];
      }
      groupedByKey[row.key].push(row);
    });

    // Analyze columns D to AH (indices 3 to 33)
    const results: {
      key: string;
      column: string;
      sections: string[];
    }[] = [];

    Object.entries(groupedByKey).forEach(([key, rows]) => {
      // Check columns D to AH (indices 3 to 33)
      for (let colIndex = 3; colIndex <= 33; colIndex++) {
        const columnName = `col${colIndex + 1}`;
        const nonEmptyCells = rows.filter(row => 
          row[columnName] !== undefined && 
          row[columnName] !== null && 
          row[columnName] !== ''
        );

        // If more than one cell has data
        if (nonEmptyCells.length > 1) {
          // Get unique section titles
          const sectionTitles = [...new Set(nonEmptyCells.map(cell => cell.sectionTitle))];
          
          results.push({
            key,
            column: columnName,
            sections: sectionTitles
          });
        }
      }
    });

    onAnalyzeData(results);
    onContentTypeChange(ContentType.DUPLICATES);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-slate-800 dark:bg-slate-900 p-4 border-r border-slate-700 z-10">
      <div className="space-y-4">
        <button
          onClick={() => onContentTypeChange(ContentType.SECTIONS)}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            activeContentType === ContentType.SECTIONS 
              ? 'bg-blue-700 text-white' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Show Sections
        </button>
        
        <button
          onClick={findDuplicateEntriesAcrossSections}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            activeContentType === ContentType.DUPLICATES 
              ? 'bg-green-700 text-white' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          Find Duplicates
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