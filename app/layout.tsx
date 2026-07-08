import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';

import { Analytics } from '@vercel/analytics/next';

import { Provider } from '@/components/ui/provider';

import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo'
});

export const metadata: Metadata = {
  title: 'Who Has It',
  description: 'Who Has It'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
        <Analytics />
      </body>
    </html>
  );
}
