import React, { useEffect, useState } from 'react';
import { ContentType } from '../ExcelLeftPanel';
import { ExcelData, Section } from '../../types/excel';

interface FindDuplicatesButtonProps {
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

export default function FindDuplicatesButton({
  activeContentType,
  onContentTypeChange,
  sections,
  excelData,
  onAnalyzeData
}: FindDuplicatesButtonProps) {
  const [hasDuplicates, setHasDuplicates] = useState(false);

  // Check for duplicates whenever sections or excelData changes
  useEffect(() => {
    if (excelData && sections.length > 0) {
      checkForDuplicates();
    }
  }, [sections, excelData]);

  const checkForDuplicates = () => {
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

    // Update the hasDuplicates state
    setHasDuplicates(results.length > 0);
  };

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
    <button
      onClick={findDuplicateEntriesAcrossSections}
      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
        hasDuplicates 
          ? 'bg-red-600 text-white hover:bg-red-700' 
          : activeContentType === ContentType.DUPLICATES 
            ? 'bg-green-700 text-white' 
            : 'bg-green-600 text-white hover:bg-green-700'
      }`}
    >
      {hasDuplicates ? 'Duplicates Found!' : 'Find Duplicates'}
    </button>
  );
} 