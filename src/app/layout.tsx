import type { Metadata } from 'next';
import './globals.css';
import { MusicProvider } from '@/context/MusicProvider';
import { AppShell } from '@/components/AppShell';
import { Toaster } from '@/components/ui/toaster';

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
      </head>
      <body className="font-body antialiased bg-black">
        <MusicProvider>
          <AppShell>
            {children}
          </AppShell>
          <Toaster />
        </MusicProvider>
      </body>
    </html>
  );
}
