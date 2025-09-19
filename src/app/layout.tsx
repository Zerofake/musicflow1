import type { Metadata, Viewport } from 'next';
import './globals.css';
import { MusicProvider } from '@/context/MusicProvider';
import { AppShell } from '@/components/AppShell';
import { Toaster } from '@/components/ui/toaster';

const APP_NAME = "Music Flow - Reprodutor de Musica MP3 e WAV";
const APP_DESCRIPTION = "Seu player de música offline com sugestões inteligentes.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
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
