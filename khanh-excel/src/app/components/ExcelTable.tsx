import React from 'react';
import { ExcelRow } from './types';

interface ExcelTableProps {
  rows: ExcelRow[];
  onExportCSV: (e: React.MouseEvent) => void;
}

export default function ExcelTable({ rows, onExportCSV }: ExcelTableProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Table Container with fixed height */}
      <div className="flex-1 overflow-auto" style={{ height: 'calc(100vh - 200px)' }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                STT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50">
                Key
              </th>
              {Array.from({ length: 49 }, (_, i) => (
                <th 
                  key={i} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50"
                >
                  {String.fromCharCode(67 + i)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={rowIndex % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.stt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.key}
                </td>
                {Array.from({ length: 49 }, (_, i) => (
                  <td 
                    key={i} 
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {row[`col${i + 3}`]?.toString() ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {rows.length} rows
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onExportCSV}
            className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
} 