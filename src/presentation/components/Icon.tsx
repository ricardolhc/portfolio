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
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18',
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
