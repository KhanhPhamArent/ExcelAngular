import React from 'react';
import { ExcelData } from '../types/excel';

interface ExcelDataSummaryProps {
  data: ExcelData;
  onExportJSON: () => void;
}

export default function ExcelDataSummary({ data, onExportJSON }: ExcelDataSummaryProps) {
  return (
    <div className="mt-4 mb-6 p-4 bg-blue-50 rounded-md">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">Data Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded shadow-sm">
          <p className="text-sm text-gray-500">Total Sections</p>
          <p className="text-xl font-bold">{data.metadata.totalSections}</p>
        </div>
        <div className="bg-white p-3 rounded shadow-sm">
          <p className="text-sm text-gray-500">Total Rows</p>
          <p className="text-xl font-bold">{data.metadata.totalRows}</p>
        </div>
        <div className="bg-white p-3 rounded shadow-sm">
          <p className="text-sm text-gray-500">Last Updated</p>
          <p className="text-sm font-medium">{new Date(data.metadata.lastUpdated).toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button 
          onClick={onExportJSON}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Export Data as JSON
        </button>
      </div>
    </div>
  );
} 