import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RaiseAdv — Software jurídico moderno',
  description: 'Gestão de processos, prazos e clientes para advogados autônomos e escritórios pequenos. Alternativa acessível ao Astrea.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
