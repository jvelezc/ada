import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Access Map - Find Wheelchair Accessible Places',
  description: 'Find and mark wheelchair accessible places worldwide',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://access-map.netlify.app',
    title: 'Access Map - Find Wheelchair Accessible Places',
    description: 'Find and mark wheelchair accessible places worldwide',
    siteName: 'Access Map',
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}