import { useState } from 'react';
import * as XLSX from 'xlsx';
import { ExcelRow, Section, ExcelData } from '../components/types';

export const useExcelProcessor = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const processExcelData = (rows: any[], fileName: string): Section[] => {
    console.log('Processing rows:', rows);
    const sections: Section[] = [];
    let currentSection: Section | null = null;
    let debugMessages: string[] = [];
    
    debugMessages.push(`Total rows in Excel: ${rows.length}`);
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) {
        debugMessages.push(`Row ${i + 1}: Empty row, skipping`);
        continue;
      }

      const firstCell = (row[0]?.toString() || '').trim();
      debugMessages.push(`Row ${i + 1}: First cell content: "${firstCell}"`);
      
      const isNumber = !isNaN(Number(firstCell)) && firstCell !== '';
      
      if (isNumber) {
        const sttValue = Number(firstCell);
        
        if (sttValue === 1) {
          if (currentSection) {
            sections.push(currentSection);
            debugMessages.push(`Saved section: ${currentSection.title} with ${currentSection.rows.length} rows`);
          }
          
          currentSection = {
            title: `Section ${sections.length + 1}`,
            rows: [],
            isCollapsed: true
          };
          debugMessages.push(`Started new section: ${currentSection.title}`);
        }
        
        if (currentSection) {
          const rowData: ExcelRow = {
            stt: sttValue,
            key: row[1]?.toString() || '',
          };
          
          for (let j = 2; j < row.length; j++) {
            if (row[j] !== undefined && row[j] !== null) {
              rowData[`col${j + 1}`] = row[j];
            }
          }
          
          currentSection.rows.push(rowData);
          debugMessages.push(`Added row to section ${currentSection.title}`);
        }
      } else if (firstCell) {
        debugMessages.push(`Row ${i + 1}: Not a number, skipping: "${firstCell}"`);
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
      debugMessages.push(`Saved final section: ${currentSection.title} with ${currentSection.rows.length} rows`);
    }
    
    debugMessages.push(`Total sections found: ${sections.length}`);
    setDebugInfo(debugMessages.join('\n'));
    
    const allRows = sections.flatMap(section => section.rows);
    const data: ExcelData = {
      sections,
      allRows,
      metadata: {
        fileName,
        totalRows: allRows.length,
        totalSections: sections.length,
        lastUpdated: new Date().toISOString()
      }
    };
    
    setExcelData(data);
    return sections;
  };

  const processWorkbook = (workbook: XLSX.WorkBook, sheetIndex: number): Section[] => {
    const validSheetIndex = Math.min(Math.max(0, sheetIndex), workbook.SheetNames.length - 1);
    const sheetName = workbook.SheetNames[validSheetIndex];
    const worksheet = workbook.Sheets[sheetName];
    
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];
    const filteredRows = rows.filter(row => 
      row.some((cell: unknown) => cell !== null && cell !== undefined && cell !== '')
    );
    
    if (filteredRows.length < 2) {
      throw new Error('Excel file must contain at least a header row and one data row');
    }

    return processExcelData(filteredRows, workbook.SheetNames[validSheetIndex]);
  };

  return {
    sections,
    excelData,
    debugInfo,
    processWorkbook,
    setSections
  };
}; 