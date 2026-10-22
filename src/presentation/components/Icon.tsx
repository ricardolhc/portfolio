type IconName =
  | 'arrow'
  | 'down'
  | 'sun'
  | 'moon'
  | 'menu'
  | 'close'
  | 'github'
  | 'linkedin'
  | 'mail'
  | 'copy'
  | 'server'
  | 'desktop'
  | 'database'
  | 'branch'
  | 'cloud'
  | 'check'
  | 'activity'
  | 'code';
const paths: Record<IconName, string> = {
  arrow: 'M5 19 19 5M5 5h14v14',
  down: 'M12 4v16m-6-6 6 6 6-6',
  sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  moon: 'M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'm6 6 12 12M6 18 18 6',
  github:
    'M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.5c3-.3 6-1.5 6-6.5a5 5 0 0 0-1.5-3.5 4.5 4.5 0 0 0-.1-3.5S17 1.5 14 3a12 12 0 0 0-6 0C5 1.5 3.6 2 3.6 2a4.5 4.5 0 0 0-.1 3.5A5 5 0 0 0 2 9c0 5 3 6.2 6 6.5A3.5 3.5 0 0 0 7 18v4',
  linkedin: 'M4 9v11M4 4v.1M9 20V9h4v2c2-4 7-2 7 2v7m-7 0v-7',
  mail: 'M3 6h18v13H3ZM3 6l9 7 9-7',
  copy: 'M8 8h13v13H8ZM16 8V3H3v13h5',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18',
  server: 'M3 3h18v7H3ZM3 14h18v7H3ZM7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6',
  desktop: 'M2 3h20v14H2ZM8 21h8M12 17v4',
  database:
    'M20 5c0 2-3.6 3-8 3S4 7 4 5s3.6-3 8-3 8 1 8 3ZM4 5v14c0 2 3.6 3 8 3s8-1 8-3V5M4 12c0 2 3.6 3 8 3s8-1 8-3',
  branch:
    'M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8v8M18 10c0 4-12 1-12 6',
  cloud:
    'M6 18a4 4 0 0 1-1-7.9 7 7 0 0 1 13-2.4A5 5 0 0 1 18 18ZM8 13h8M12 9v8',
  check: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6ZM8 12l3 3 5-6',
  activity: 'M3 3v18h18M6 14l4-5 4 3 5-7',
};
export function Icon({
  name,
  className = '',
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
