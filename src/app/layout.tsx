import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] });

const SideMenu = dynamic(() => import('@/components/SideMenu'), { 
  ssr: true,
  loading: () => null 
});

export const metadata: Metadata = {
  title: 'Accessibility Map',
  description: 'Interactive map showing ADA-compliant locations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <SideMenu />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}