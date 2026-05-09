import {
  AlignmentType,
  Document,
  Footer,
  HeadingLevel,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { doctorsApi } from '@/lib/api';
import { type DoctorListItem, type GetDoctorsQuery, statusLabel } from '@/lib/types';

const EXPORT_PAGE_SIZE = 100;
const TEAL_FILL = '0F766E';

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function buildFilterDescription(query: GetDoctorsQuery): string {
  const parts: string[] = [];
  if (query.search) parts.push(`Search: "${query.search}"`);
  if (query.status !== undefined) parts.push(`Status: ${statusLabel[query.status]}`);
  return parts.length > 0 ? `Filtered by ${parts.join(' · ')}` : 'All doctors';
}

export async function fetchAllDoctorsForExport(
  query: GetDoctorsQuery
): Promise<DoctorListItem[]> {
  const all: DoctorListItem[] = [];
  let pageNumber = 1;

  while (true) {
    const result = await doctorsApi.list({ ...query, pageNumber, pageSize: EXPORT_PAGE_SIZE });
    all.push(...result.items);
    if (!result.hasNextPage) break;
    pageNumber += 1;
    if (pageNumber > 100) break;
  }

  return all;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeCsvField(value: string | number | null | undefined): string {
  const str = String(value ?? '');
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCsv(doctors: DoctorListItem[], filenameDate: string) {
  const headers = [
    'ID',
    'Full Name',
    'Email',
    'Specialization',
    'License Number',
    'License Expiry Date',
    'Status',
    'Created Date',
  ];

  const rows = doctors.map((d) => [
    d.id,
    d.fullName,
    d.email,
    d.specialization,
    d.licenseNumber,
    d.licenseExpiryDate,
    statusLabel[d.status],
    d.createdDate,
  ]);

  const csv =
    '﻿' +
    [headers, ...rows].map((row) => row.map(escapeCsvField).join(',')).join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, `doctors-${filenameDate}.csv`);
}

function headerCell(text: string): TableCell {
  return new TableCell({
    shading: { fill: TEAL_FILL, type: ShadingType.CLEAR, color: 'auto' },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 22 })],
      }),
    ],
  });
}

function dataCell(text: string): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, size: 20 })],
      }),
    ],
  });
}

export async function exportToDocx(
  doctors: DoctorListItem[],
  query: GetDoctorsQuery,
  filenameDate: string
): Promise<void> {
  const filterDescription = buildFilterDescription(query);
  const generatedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      headerCell('Name'),
      headerCell('Email'),
      headerCell('Specialization'),
      headerCell('License'),
      headerCell('Expiry'),
      headerCell('Status'),
    ],
  });

  const dataRows = doctors.map(
    (d) =>
      new TableRow({
        children: [
          dataCell(d.fullName),
          dataCell(d.email),
          dataCell(d.specialization),
          dataCell(d.licenseNumber),
          dataCell(formatDate(d.licenseExpiryDate)),
          dataCell(statusLabel[d.status]),
        ],
      })
  );

  const doc = new Document({
    creator: 'DocLicense',
    title: 'Doctor License Report',
    description: 'Doctor License Management — generated report',
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'Doctor License Report',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on ${generatedDate}`,
                italics: true,
                color: '6B7280',
                size: 20,
              }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${filterDescription} · ${doctors.length} record${doctors.length === 1 ? '' : 's'}`,
                color: '4B5563',
                size: 20,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [headerRow, ...dataRows],
          }),
        ],
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: '9CA3AF',
                  }),
                ],
              }),
            ],
          }),
        },
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `doctors-${filenameDate}.docx`);
}
