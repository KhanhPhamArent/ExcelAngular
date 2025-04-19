'use client';

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { ExcelData } from './types';
import ExcelSection from './ExcelSection';
import ExcelRightPanel from './ExcelRightPanel';
import ExcelLeftPanel from './ExcelLeftPanel';
import { useExcelProcessor } from '../hooks/useExcelProcessor';
import { useFileHandler } from '../hooks/useFileHandler';

export default function ExcelUpload() {
  const [sheetIndex, setSheetIndex] = useState<number>(0);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [showSections, setShowSections] = useState(false);
  
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
      setShowSections(true);
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
    <div className="flex h-full">
      {/* Left Panel */}
      <ExcelLeftPanel
        showSections={showSections}
        onToggleSections={() => setShowSections(!showSections)}
        sections={sections}
        excelData={excelData}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto ml-64">
        <div className={`p-6 ${isPanelVisible ? "pr-80" : ""}`}>
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
          
          {showSections && sections.length > 0 && (
            <div className="space-y-8">
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
      </div>

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