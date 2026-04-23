import { cn } from '@/lib/utils';

interface MissingFieldProps {
  label: string;
  className?: string;
}

export function MissingField({ label, className }: MissingFieldProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border border-dashed border-zinc-300 bg-zinc-50 px-1.5 py-0.5 text-xs font-medium text-zinc-500 italic',
        className,
      )}
    >
      {label}
    </span>
  );
}
