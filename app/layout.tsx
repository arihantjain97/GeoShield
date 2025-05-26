import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { MainNav } from '@/components/main-nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GeoShield™ - Enterprise Geofencing & Device Monitoring',
  description: 'Carrier-grade geofencing and device-health monitoring for high-value mobile assets and field workers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <MainNav />
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}