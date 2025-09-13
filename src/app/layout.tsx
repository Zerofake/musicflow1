import type { Metadata } from 'next';
import './globals.css';
import { MusicProvider } from '@/context/MusicProvider';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Music Flow',
  description: 'Seu player de música offline com sugestões inteligentes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-black">
        <MusicProvider>
          <AppShell>
            {children}
          </AppShell>
        </MusicProvider>
      </body>
    </html>
  );
}
