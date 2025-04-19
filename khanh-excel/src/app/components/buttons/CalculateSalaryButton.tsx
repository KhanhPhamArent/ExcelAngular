import React from 'react';
import { ExcelData, Section } from '../../types/excel';
import { ContentType } from '../ExcelLeftPanel';

interface CalculateSalaryButtonProps {
  activeContentType: ContentType;
  onContentTypeChange: (contentType: ContentType) => void;
  sections: Section[];
  excelData: ExcelData | null;
  onAnalyzeData: (results: {
    key: string;
    column: string;
    sections: string[];
    value?: string;
  }[]) => void;
}

export default function CalculateSalaryButton({
  activeContentType,
  onContentTypeChange,
  sections,
  excelData,
  onAnalyzeData
}: CalculateSalaryButtonProps) {
  const calculateSalary = () => {
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

    // Process data for each key
    const results: {
      key: string;
      column: string;
      sections: string[];
      value?: string;
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
        if (nonEmptyCells.length > 0) {
          // Get unique section titles
          const sectionTitles = [...new Set(nonEmptyCells.map(cell => cell.sectionTitle))];
          
          // Add each non-empty cell with its value
          nonEmptyCells.forEach(cell => {
            results.push({
              key,
              column: columnName,
              sections: [cell.sectionTitle],
              value: cell[columnName]
            });
          });
        }
      }

      // Calculate totals for columns AV to AX (indices 47 to 49)
      for (let colIndex = 47; colIndex <= 49; colIndex++) {
        const columnName = `col${colIndex + 1}`;
        const nonEmptyCells = rows.filter(row => 
          row[columnName] !== undefined && 
          row[columnName] !== null && 
          row[columnName] !== ''
        );

        if (nonEmptyCells.length > 0) {
          const total = nonEmptyCells.reduce((sum, cell) => {
            const value = parseFloat(cell[columnName]);
            return isNaN(value) ? sum : sum + value;
          }, 0);

          results.push({
            key,
            column: `${columnName} (Total: ${Math.round(total)})`,
            sections: ['Total']
          });
        }
      }
    });

    onAnalyzeData(results);
    onContentTypeChange(ContentType.SALARY);
  };

  return (
    <button
      onClick={calculateSalary}
      className={`w-full py-2 px-4 rounded-md text-left transition-colors ${
        activeContentType === ContentType.SALARY
          ? 'bg-blue-600 text-white'
          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
      }`}
    >
      Calculate Salary
    </button>
  );
} 