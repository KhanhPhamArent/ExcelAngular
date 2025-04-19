import ExcelUpload from './components/ExcelUpload';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-50 dark:to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-100 dark:text-slate-800 mb-3">Excel File Reader</h1>
          <p className="text-slate-300 dark:text-slate-600 max-w-2xl mx-auto">
            Upload your Excel file to view and analyze its contents in a structured format.
          </p>
        </header>
        
        <main className="max-w-6xl mx-auto">
          <ExcelUpload />
        </main>
        
        <footer className="mt-16 text-center text-slate-400 dark:text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Excel File Reader. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
