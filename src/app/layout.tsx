import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import SideMenu from '@/components/SideMenu';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
        <ThemeProvider>
          <SideMenu />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}