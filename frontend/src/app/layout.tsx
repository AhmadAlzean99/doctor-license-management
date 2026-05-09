import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { KeyboardShortcuts } from '@/components/ui/KeyboardShortcuts';
import { TopProgressBar } from '@/components/ui/TopProgressBar';
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
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <KeyboardShortcuts />
        <Header />
        <main className="mx-auto max-w-screen-2xl px-8 py-8">{children}</main>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
