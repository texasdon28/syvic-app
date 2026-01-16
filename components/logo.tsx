import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'mark';
  className?: string;
  href?: string;
}

export function Logo({ variant = 'full', className = '', href = '/' }: LogoProps) {
  const logoSrc = variant === 'full' ? '/brand/syvic-logo.svg' : '/brand/syvic-mark.svg';
  const alt = variant === 'full' ? 'SYVIC' : 'S';
  const width = variant === 'full' ? 120 : 32;
  const height = 32;

  const logo = (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logo}
      </Link>
    );
  }

  return logo;
}
