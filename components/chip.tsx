import type { ReactNode } from 'react';

type ChipVariant = 'default' | 'solid' | 'accent';

export default function Chip({
  variant = 'default',
  pulse,
  children,
  className,
  ...rest
}: { variant?: ChipVariant; pulse?: boolean; children: ReactNode; className?: string } & React.HTMLAttributes<HTMLSpanElement>) {
  const cls = ['chip', variant === 'solid' ? 'solid' : variant === 'accent' ? 'accent' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={cls} {...rest}>
      {pulse ? <span className="pulse" /> : null}
      {children}
    </span>
  );
}
