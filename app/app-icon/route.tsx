import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET(request: Request) {
  const requested = Number(new URL(request.url).searchParams.get('size'));
  const size = [180, 192, 512].includes(requested) ? requested : 512;
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', fontSize: size * 0.5, fontWeight: 700 }}>S</div>,
    { width: size, height: size },
  );
}
