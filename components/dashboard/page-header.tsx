import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui';

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}

export function PageHeader({ icon: Icon, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          {Icon && <Icon className="h-6 w-6 text-brand" />}
          {title}
        </h1>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </div>
      {action && (
        <Link href={action.href}>
          <Button size="md">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}
