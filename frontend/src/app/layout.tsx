import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'DocLicense — Doctor License Management',
  description: 'Manage doctor licenses, statuses, and renewals on a medical SaaS platform.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Header />
        <div className="mx-auto flex max-w-7xl">
          <Suspense fallback={<div className="hidden w-60 shrink-0 lg:block" />}>
            <Sidebar />
          </Suspense>
          <main className="min-w-0 flex-1 px-6 py-8">{children}</main>
        </div>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
