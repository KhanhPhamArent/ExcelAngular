'use client';

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { ExcelData } from './types';
import ExcelSection from './ExcelSection';
import ExcelRightPanel from './ExcelRightPanel';
import ExcelLeftPanel, { ContentType } from './ExcelLeftPanel';
import ExcelAnalysisResults from './ExcelAnalysisResults';
import ExcelMainPanel from './ExcelMainPanel';
import { useExcelProcessor } from '../hooks/useExcelProcessor';
import { useFileHandler } from '../hooks/useFileHandler';
import DuplicateEntriesResults from './DuplicateEntriesResults';

export default function ExcelUpload() {
  const [sheetIndex, setSheetIndex] = useState<number>(0);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [activeContentType, setActiveContentType] = useState<ContentType>(ContentType.SECTIONS);
  const [analysisResults, setAnalysisResults] = useState<{
    key: string;
    column: string;
    sections: string[];
  }[]>([]);
  
  const {
    sections,
    excelData,
    setSections,
    processWorkbook
  } = useExcelProcessor();

  const {
    file,
    error,
    isLoading,
    availableSheets,
    handleFileUpload
  } = useFileHandler();

  const handleWorkbookProcessed = useCallback((workbook: XLSX.WorkBook) => {
    try {
      const processedSections = processWorkbook(workbook, sheetIndex);
      if (processedSections.length === 0) {
        throw new Error('No valid sections found in the Excel file. Please check the debug information below for details.');
      }
      setSections(processedSections);
      setActiveContentType(ContentType.SECTIONS);
    } catch (err) {
      console.error('Error processing workbook:', err);
      throw err;
    }
  }, [sheetIndex, processWorkbook, setSections]);

  const handleSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setSheetIndex(value);
      if (file) {
        try {
          // Read the file and process it
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const data = event.target?.result;
              if (!data) {
                throw new Error('Failed to read file data');
              }

              const workbook = XLSX.read(data, { type: 'binary' });
              const processedSections = processWorkbook(workbook, value);
              if (processedSections.length === 0) {
                throw new Error('No valid sections found in the Excel file. Please check the debug information below for details.');
              }
              setSections(processedSections);
              setActiveContentType(ContentType.SECTIONS);
            } catch (err) {
              console.error('Error processing sheet:', err);
              // If there's an error, fall back to the original file upload method
              const input = document.createElement('input');
              input.type = 'file';
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              input.files = dataTransfer.files;
              handleFileUpload({ target: input } as unknown as React.ChangeEvent<HTMLInputElement>, value, handleWorkbookProcessed);
            }
          };
          reader.readAsBinaryString(file);
        } catch (err) {
          console.error('Error reading file:', err);
          // If there's an error reading the file, fall back to the original method
          const input = document.createElement('input');
          input.type = 'file';
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          input.files = dataTransfer.files;
          handleFileUpload({ target: input } as unknown as React.ChangeEvent<HTMLInputElement>, value, handleWorkbookProcessed);
        }
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

  const handleAnalyzeData = (results: {
    key: string;
    column: string;
    sections: string[];
  }[]) => {
    setAnalysisResults(results);
  };

  return (
    <div className="flex h-full">
      {/* Left Panel */}
      <ExcelLeftPanel
        activeContentType={activeContentType}
        onContentTypeChange={setActiveContentType}
        sections={sections}
        excelData={excelData}
        onAnalyzeData={handleAnalyzeData}
      />

      {/* Main Content */}
      <ExcelMainPanel
        isLoading={isLoading}
        error={error}
        sections={sections}
        activeContentType={activeContentType}
        analysisResults={analysisResults}
        isPanelVisible={isPanelVisible}
        onToggleSection={toggleSection}
      />

      {/* Right Panel */}
      <ExcelRightPanel
        isVisible={isPanelVisible}
        onToggle={() => setIsPanelVisible(!isPanelVisible)}
        sheetIndex={sheetIndex}
        availableSheets={availableSheets}
        onSheetChange={handleSheetChange}
        onFileUpload={(e) => handleFileUpload(e, sheetIndex, handleWorkbookProcessed)}
        isLoading={isLoading}
        excelData={excelData}
        onExportJSON={exportDataAsJSON}
      />
    </div>
  );
} 