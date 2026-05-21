import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import ImagePlaceholder from './image-placeholder';

// A real (duotoned) photo if the file exists on disk at build time, otherwise the
// editorial placeholder — same footprint either way. Lets photo slots be wired
// ahead of the actual photos: drop a processed webp into public/<src>, rebuild,
// and it appears with no code change. (Server component; the page renders static,
// so the existsSync check is resolved once at build and baked into the HTML.)
export default function DuoPhoto({
  src,
  alt,
  label,
  ratio = '4 / 3',
  className,
}: {
  src: string; // public-relative, e.g. /images/hobbies/am8.webp
  alt: string; // used when the file exists
  label: string; // placeholder caption when it doesn't
  ratio?: string;
  className?: string;
}) {
  const exists = fs.existsSync(path.join(process.cwd(), 'public', src));
  if (!exists) {
    return <ImagePlaceholder label={label} ratio={ratio} className={className} />;
  }
  return (
    <div
      className={['duo-photo', className].filter(Boolean).join(' ')}
      style={{ aspectRatio: ratio }}
    >
      <Image src={src} alt={alt} fill sizes="(max-width: 980px) 100vw, 480px" />
    </div>
  );
}
