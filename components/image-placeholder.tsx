import type { CSSProperties } from 'react';

export default function ImagePlaceholder({
  label,
  ratio = '16 / 10',
  height,
  dark,
  className,
}: {
  label: string;
  ratio?: string;
  height?: number | string;
  dark?: boolean;
  className?: string;
}) {
  const style: CSSProperties = { aspectRatio: ratio };
  if (height !== undefined) style.height = height;
  return (
    <div className={['imgph', dark ? 'dark' : '', className].filter(Boolean).join(' ')} style={style}>
      <span>{label}</span>
    </div>
  );
}
