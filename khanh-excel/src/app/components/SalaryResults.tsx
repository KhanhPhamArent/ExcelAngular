import React, { useState } from 'react';
import SalaryDetailsModal from './SalaryDetailsModal';

interface SalaryResultsProps {
  results: {
    key: string;
    column: string;
    sections: string[];
    value?: string;
  }[];
}

interface ProcessedData {
  key: string;
  holiday: number;
  normal: number;
  weekend: number;
  bhxh: number;
  cc: number;
  salary: number;
}

interface SectionData {
  section: string;
  holiday: number;
  normal: number;
  weekend: number;
  bhxh: number;
  cc: number;
  salary: number;
}

export default function SalaryResults({ results }: SalaryResultsProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  
  // Process the results into a format suitable for the table
  const processedData: ProcessedData[] = [];
  const sectionDetails: Record<string, Record<string, SectionData>> = {};
  
  // Group results by key
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.key]) {
      acc[result.key] = [];
    }
    acc[result.key].push(result);
    return acc;
  }, {} as Record<string, typeof results>);

  // Process each key's data
  Object.entries(groupedResults).forEach(([key, items]) => {
    const data: ProcessedData = {
      key,
      holiday: 0,
      normal: 0,
      weekend: 0,
      bhxh: 0,
      cc: 0,
      salary: 0
    };

    // Initialize section details for this key
    sectionDetails[key] = {};

    items.forEach(item => {
      // Check if this is a total calculation (from columns AV-AX)
      if (item.column.includes(' (Total: ')) {
        const columnName = item.column.split(' (Total: ')[0];
        const total = parseFloat(item.column.split(' (Total: ')[1].replace(')', ''));
        
        if (columnName === 'col48') { // AV column
          data.bhxh = total;
          // Add BHXH to each section's data
          Object.values(sectionDetails[key]).forEach(section => {
            section.bhxh = total / Object.keys(sectionDetails[key]).length;
          });
        } else if (columnName === 'col49') { // AW column
          data.cc = total;
          // Add CC to each section's data
          Object.values(sectionDetails[key]).forEach(section => {
            section.cc = total / Object.keys(sectionDetails[key]).length;
          });
        } else if (columnName === 'col50') { // AX column
          data.salary = total;
          // Add salary to each section's data
          Object.values(sectionDetails[key]).forEach(section => {
            section.salary = total / Object.keys(sectionDetails[key]).length;
          });
        }
      } else {
        // This is a data point from columns D-AH
        // Count occurrences of specific values
        if (item.value) {
          const value = item.value.toString().trim().toUpperCase();
          const section = item.sections[0];
          
          // Initialize section data if not exists
          if (!sectionDetails[key][section]) {
            sectionDetails[key][section] = {
              section,
              holiday: 0,
              normal: 0,
              weekend: 0,
              bhxh: 0,
              cc: 0,
              salary: 0
            };
          }
          
          if (value === 'NL') {
            data.holiday++;
            sectionDetails[key][section].holiday++;
          } else if (value === '+') {
            data.normal++;
            sectionDetails[key][section].normal++;
          } else if (value === 'TC') {
            data.weekend++;
            sectionDetails[key][section].weekend++;
          }
        }
      }
    });

    processedData.push(data);
  });

  const handleShowDetails = (key: string) => {
    setSelectedKey(key);
  };

  const handleCloseModal = () => {
    setSelectedKey(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 border-b pb-2">
        Salary Calculation Results
      </h2>
      
      {processedData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Key
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Holiday (NL)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Normal (+)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Weekend (TC)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  BHXH
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  CC
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Salary
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {processedData.map((data, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">
                    {data.key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                    {data.holiday}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                    {data.normal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                    {data.weekend}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                    {Math.round(data.bhxh).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                    {Math.round(data.cc).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                    {Math.round(data.salary).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                    <button
                      onClick={() => handleShowDetails(data.key)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Show Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800 flex items-center">
          <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p className="text-green-800 dark:text-green-200">
            No salary data found.
          </p>
        </div>
      )}

      {selectedKey && (
        <SalaryDetailsModal
          isOpen={true}
          onClose={handleCloseModal}
          data={{
            key: selectedKey,
            details: Object.values(sectionDetails[selectedKey])
          }}
        />
      )}
    </div>
  );
} 