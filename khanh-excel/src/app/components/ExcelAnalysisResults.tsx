import React from 'react';

interface DuplicateEntriesResultsProps {
  results: {
    key: string;
    column: string;
    sections: string[];
  }[];
}

export default function DuplicateEntriesResults({ results }: DuplicateEntriesResultsProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
        Data Analysis Results
      </h2>
      
      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold mr-3">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Key: <span className="font-mono">{result.key}</span>
                </h3>
              </div>
              
              <div className="ml-11">
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  <span className="font-medium">Column:</span> {result.column}
                </p>
                
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Found in sections:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.sections.map((section, i) => (
                      <li key={i} className="text-slate-600 dark:text-slate-400">
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-green-800 dark:text-green-200">
            No conflicts found. All cells are either empty or only one section has data.
          </p>
        </div>
      )}
    </div>
  );
} 