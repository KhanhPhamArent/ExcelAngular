import React from 'react';
import { ExcelData, Section } from '../../types/excel';

interface StatsDisplayProps {
  sections: Section[];
  excelData: ExcelData | null;
}

export default function StatsDisplay({
  sections,
  excelData
}: StatsDisplayProps) {
  if (sections.length === 0) return null;
  
  return (
    <div className="mt-4 text-slate-300 text-sm">
      <p>Total Sections: {sections.length}</p>
      <p>Total Rows: {excelData?.metadata.totalRows || 0}</p>
    </div>
  );
} 