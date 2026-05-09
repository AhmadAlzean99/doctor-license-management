'use client';

import { ChevronDown, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { DoctorStatus, type GetDoctorsQuery } from '@/lib/types';

export function ExportMenu() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  function buildQuery(): GetDoctorsQuery {
    return {
      search: searchParams.get('search') ?? undefined,
      status: searchParams.get('status')
        ? (Number(searchParams.get('status')) as DoctorStatus)
        : undefined,
    };
  }

  async function handleExport(format: 'csv' | 'docx') {
    setOpen(false);
    setExporting(true);

    try {
      const query = buildQuery();
      const exportLib = await import('@/lib/export');
      const doctors = await exportLib.fetchAllDoctorsForExport(query);

      if (doctors.length === 0) {
        toast.error('No doctors to export with the current filters.');
        return;
      }

      const date = new Date().toISOString().slice(0, 10);

      if (format === 'csv') {
        exportLib.exportToCsv(doctors, date);
      } else {
        await exportLib.exportToDocx(doctors, query, date);
      }

      toast.success(
        `Exported ${doctors.length} doctor${doctors.length === 1 ? '' : 's'} to ${format.toUpperCase()}`
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Export failed.';
      toast.error(msg);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <Button
        variant="secondary"
        loading={exporting}
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {!exporting && <Download className="h-4 w-4" />}
        Export
        {!exporting && (
          <ChevronDown
            className={`h-3.5 w-3.5 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        )}
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-56 animate-fade-in rounded-lg border border-stone-200 bg-white p-1 shadow-lg ring-1 ring-stone-900/5"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handleExport('csv')}
            className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-stone-50"
          >
            <FileSpreadsheet className="mt-0.5 h-4 w-4 text-emerald-600" />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-stone-900">Download CSV</span>
              <span className="text-xs text-stone-500">Excel-compatible</span>
            </span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => handleExport('docx')}
            className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-stone-50"
          >
            <FileText className="mt-0.5 h-4 w-4 text-blue-600" />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-stone-900">Download Word</span>
              <span className="text-xs text-stone-500">Formatted .docx report</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
