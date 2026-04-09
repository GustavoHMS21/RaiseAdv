import Link from 'next/link';
import { Button } from '@/components/ui';

interface EmptyStateProps {
  message: string;
  action?: { href: string; label: string };
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="text-sm text-slate-500">{message}</p>
      {action && (
        <Link href={action.href} className="mt-4 inline-block">
          <Button variant="secondary" size="sm">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}
