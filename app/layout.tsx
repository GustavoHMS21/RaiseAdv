import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1E3A8A',
};

export const metadata: Metadata = {
  title: {
    default: 'RaiseAdv — Software jurídico moderno',
    template: '%s | RaiseAdv',
  },
  description: 'Gestão de processos, prazos e clientes para advogados autônomos e escritórios pequenos. Alternativa acessível ao Astrea.',
  metadataBase: new URL('https://raiseadv.com.br'),
  openGraph: {
    title: 'RaiseAdv — Software jurídico moderno',
    description: 'Gestão de processos, prazos e clientes para advogados. Calcule prazos em dias úteis (CPC/2015), controle financeiro e LGPD integrada.',
    siteName: 'RaiseAdv',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
