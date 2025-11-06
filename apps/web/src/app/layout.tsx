import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Turkish Baby Name Finder',
  description:
    'Interaktif Türk bebek ismi bulucu - 60 saniyede size özel isim önerileri',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
