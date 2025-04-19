import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

export const useFileHandler = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);

  const handleFileUpload = useCallback(async (
    e: React.ChangeEvent<HTMLInputElement>,
    sheetIndex: number,
    onWorkbookProcessed: (workbook: XLSX.WorkBook) => void
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);
    setIsLoading(true);
    setFile(selectedFile);

    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          if (!data) {
            throw new Error('Failed to read file data');
          }

          const workbook = XLSX.read(data, { type: 'binary' });
          setAvailableSheets(workbook.SheetNames);
          onWorkbookProcessed(workbook);
        } catch (err) {
          console.error('Error processing file:', err);
          setError(err instanceof Error ? err.message : 'Failed to process Excel file');
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read the file');
        setIsLoading(false);
      };
      
      reader.readAsBinaryString(selectedFile);
    } catch (err) {
      console.error('Error in file upload:', err);
      setError(err instanceof Error ? err.message : 'Failed to read Excel file');
      setIsLoading(false);
    }
  }, []);

  return {
    file,
    error,
    isLoading,
    availableSheets,
    handleFileUpload
  };
}; 