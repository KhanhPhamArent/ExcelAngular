export interface ExcelRow {
  stt: number | string;
  key: string;
  excelRowIndex?: number;
  [key: string]: any;
}

export interface Section {
  title: string;
  rows: ExcelRow[];
  isCollapsed?: boolean;
}

export interface ExcelData {
  sections: Section[];
  allRows: ExcelRow[];
  metadata: {
    fileName: string;
    totalRows: number;
    totalSections: number;
    lastUpdated: string;
  };
} 