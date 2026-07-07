import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Who Has It',
  description: 'Who Has It'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
