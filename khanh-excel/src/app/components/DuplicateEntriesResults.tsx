import React from 'react';

interface DuplicateEntriesResultsProps {
  results: {
    key: string;
    column: string;
    sections: string[];
  }[];
}

// Helper function to convert column number to Excel column letter
const getExcelColumnName = (columnNumber: number): string => {
  let columnName = '';
  let num = columnNumber;
  
  while (num > 0) {
    const remainder = (num - 1) % 26;
    columnName = String.fromCharCode(65 + remainder) + columnName;
    num = Math.floor((num - 1) / 26);
  }
  
  return columnName;
};

// Helper function to convert column identifier (e.g., "col4") to Excel column name
const getColumnDisplayName = (columnId: string): string => {
  // Extract the number from the column identifier (e.g., "col4" -> 4)
  const match = columnId.match(/col(\d+)/);
  if (match && match[1]) {
    const columnNumber = parseInt(match[1], 10);
    return getExcelColumnName(columnNumber);
  }
  return columnId; // Fallback to original if pattern doesn't match
};

export default function DuplicateEntriesResults({ results }: DuplicateEntriesResultsProps) {
  // Group results by key
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.key]) {
      acc[result.key] = [];
    }
    acc[result.key].push(result);
    return acc;
  }, {} as Record<string, typeof results>);

  // Convert grouped results to array for rendering
  const groupedResultsArray = Object.entries(groupedResults).map(([key, items]) => ({
    key,
    items
  }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 border-b pb-2">
        Data Analysis Results
      </h2>
      
      {results.length > 0 ? (
        <div className="space-y-6">
          {groupedResultsArray.map((group, index) => (
            <div key={index} className="bg-slate-50 dark:bg-slate-700 p-5 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
              <div className="flex items-center mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold mr-3">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Duplicate Entry: <span className="font-mono bg-slate-100 dark:bg-slate-600 px-2 py-1 rounded">{group.key}</span>
                </h3>
              </div>
              
              <div className="ml-11 space-y-4">
                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-slate-100 dark:bg-slate-600 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-slate-700 dark:text-slate-300 mr-2">Column:</span>
                      <span className="bg-white dark:bg-slate-700 px-2 py-1 rounded text-slate-800 dark:text-slate-200">
                        {getColumnDisplayName(item.column)}
                      </span>
                    </div>
                    
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Found in sections:
                      </p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {item.sections.map((section, i) => (
                          <li key={i} className="bg-white dark:bg-slate-700 px-3 py-1.5 rounded text-slate-700 dark:text-slate-300">
                            {section}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800 flex items-center">
          <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p className="text-green-800 dark:text-green-200">
            No conflicts found. All cells are either empty or only one section has data.
          </p>
        </div>
      )}
    </div>
  );
} 