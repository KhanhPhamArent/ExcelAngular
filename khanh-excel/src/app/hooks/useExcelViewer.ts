import { useState, useEffect } from 'react';
import { ExcelRow, Section, ExcelData } from '../types/excel';

export const useExcelViewer = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);

  useEffect(() => {
    if (sections.length > 0) {
      const allRows = sections.flatMap(section => section.rows);
      
      const data: ExcelData = {
        sections,
        allRows,
        metadata: {
          fileName: '',  // This will be set by the file handler
          totalRows: allRows.length,
          totalSections: sections.length,
          lastUpdated: new Date().toISOString()
        }
      };
      
      setExcelData(data);
    }
  }, [sections]);

  const processExcelData = (rows: any[]): Section[] => {
    const sections: Section[] = [];
    let currentSection: Section | null = null;
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const firstCell = row[0]?.toString().trim() || '';
      
      // Check if this is a section header (contains "STT.")
      if (firstCell === 'STT.') {
        // If we have a previous section, save it
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Start a new section
        currentSection = {
          title: `Section ${i + 1}: ${row[1]?.toString() || 'Untitled Section'}`,
          rows: []
        };
        continue;
      }
      
      // If we have a current section and this row has a number in column A
      if (currentSection && !isNaN(Number(firstCell))) {
        const rowData: ExcelRow = {
          stt: Number(firstCell),
          key: row[1]?.toString() || '',
        };
        
        // Add all other columns (C to AX)
        for (let j = 2; j < row.length; j++) {
          rowData[`col${j + 1}`] = row[j];
        }
        
        currentSection.rows.push(rowData);
      }
    }
    
    // Add the last section if exists
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  return {
    sections,
    excelData,
    setSections,
    processExcelData
  };
}; 