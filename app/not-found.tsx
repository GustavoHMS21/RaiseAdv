import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-brand">404</h1>
      <p className="mt-2 text-lg text-slate-600">Página não encontrada</p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Voltar ao dashboard
      </Link>
    </div>
  );
}
