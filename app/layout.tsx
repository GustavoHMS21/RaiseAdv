import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JusFlow — Software jurídico moderno',
  description: 'Gestão de processos, prazos e clientes para advogados autônomos e escritórios pequenos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
