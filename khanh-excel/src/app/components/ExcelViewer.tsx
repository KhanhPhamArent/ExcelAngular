'use client';

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useExcelViewer } from '../hooks/useExcelViewer';
import { useFileHandler } from '../hooks/useFileHandler';
import ExcelFileUpload from './ExcelFileUpload';
import ExcelDataSummary from './ExcelDataSummary';
import ExcelSection from './ExcelSection';

export default function ExcelViewer() {
  const [sheetIndex, setSheetIndex] = useState<number>(0);
  
  const {
    sections,
    excelData,
    setSections,
    processExcelData
  } = useExcelViewer();

  const {
    file,
    error,
    isLoading,
    availableSheets,
    handleFileUpload
  } = useFileHandler();

  const handleWorkbookProcessed = useCallback((workbook: XLSX.WorkBook) => {
    try {
      const validSheetIndex = Math.min(Math.max(0, sheetIndex), workbook.SheetNames.length - 1);
      const sheetName = workbook.SheetNames[validSheetIndex];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (rows.length < 2) {
        throw new Error('Excel file must contain at least a header row and one data row');
      }

      const processedSections = processExcelData(rows);
      setSections(processedSections);
    } catch (err) {
      console.error('Error processing workbook:', err);
      throw err;
    }
  }, [processExcelData, setSections, sheetIndex]);

  const handleSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setSheetIndex(value);
      if (file) {
        const input = document.createElement('input');
        input.type = 'file';
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        handleFileUpload({ target: input } as unknown as React.ChangeEvent<HTMLInputElement>, value, handleWorkbookProcessed);
      }
    }
  };

  const toggleSection = (sectionIndex: number) => {
    setSections(prevSections => 
      prevSections.map((section, index) => 
        index === sectionIndex 
          ? { ...section, isCollapsed: !section.isCollapsed }
          : section
      )
    );
  };

  const exportDataAsJSON = () => {
    if (!excelData) return;
    
    const dataStr = JSON.stringify(excelData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = file?.name.replace(/\.[^/.]+$/, '') + '_data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <ExcelFileUpload
        sheetIndex={sheetIndex}
        availableSheets={availableSheets}
        onSheetChange={handleSheetChange}
        onFileUpload={(e) => handleFileUpload(e, sheetIndex, handleWorkbookProcessed)}
        isLoading={isLoading}
      />
      
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Processing file...</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {file && !error && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Selected file: <span className="font-medium">{file.name}</span>
          </p>
        </div>
      )}
      
      {excelData && (
        <ExcelDataSummary
          data={excelData}
          onExportJSON={exportDataAsJSON}
        />
      )}
      
      {sections.length > 0 && (
        <div className="mt-6 space-y-8">
          {sections.map((section, sectionIndex) => (
            <ExcelSection
              key={sectionIndex}
              section={section}
              onToggle={() => toggleSection(sectionIndex)}
            />
          ))}
        </div>
      )}
    </div>
  );
} 