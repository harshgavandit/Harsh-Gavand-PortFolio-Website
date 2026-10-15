import { profile } from "../data/portfolio";

export function GitHubMark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path
        fill="#030712"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.8c-4.52 0-8.2 3.67-8.2 8.2 0 3.63 2.35 6.7 5.61 7.78.41.08.56-.18.56-.4 0-.19-.01-.71-.01-1.39-2.28.5-2.76-1.1-2.76-1.1-.37-.95-.91-1.2-.91-1.2-.75-.51.06-.5.06-.5.82.06 1.26.85 1.26.85.73 1.26 1.92.89 2.39.68.07-.53.29-.89.52-1.1-1.82-.21-3.74-.91-3.74-4.06 0-.9.32-1.63.85-2.2-.08-.21-.37-1.04.08-2.17 0 0 .69-.22 2.26.84a7.86 7.86 0 0 1 2.06-.28c.7 0 1.4.09 2.06.28 1.57-1.06 2.26-.84 2.26-.84.45 1.13.16 1.96.08 2.17.53.57.85 1.3.85 2.2 0 3.16-1.92 3.85-3.75 4.05.29.25.56.76.56 1.52 0 1.1-.01 1.99-.01 2.26 0 .22.15.48.57.4 3.26-1.08 5.6-4.15 5.6-7.78 0-4.53-3.68-8.2-8.2-8.2z"
      />
    </svg>
  );
}

export function LinkedInMark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="4.5" fill="currentColor" />
      <path
        fill="#030712"
        d="M19 19h-3.1v-4.85c0-1.16-.02-2.65-1.62-2.65-1.62 0-1.87 1.26-1.87 2.57V19h-3.1V9h2.98v1.36h.04c.41-.78 1.42-1.61 2.92-1.61 3.13 0 3.71 2.06 3.71 4.74V19zM6.88 7.63c-1 0-1.8-.81-1.8-1.81 0-1 .8-1.81 1.8-1.81 1 0 1.8.81 1.8 1.81 0 1-.8 1.81-1.8 1.81zm1.55 11.37h-3.1V9h3.1v10z"
      />
    </svg>
  );
}

export function CornerSocials() {
  return (
    <aside className="corner-socials" aria-label="Social connections">
      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Harsh Gavand on GitHub (opens in new tab)"
        className="corner-social-btn"
        title="GitHub / @harshgavandit"
      >
        <GitHubMark size={22} />
      </a>
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Harsh Gavand on LinkedIn (opens in new tab)"
        className="corner-social-btn"
        title="LinkedIn / harsh-gavand"
      >
        <LinkedInMark size={22} />
      </a>
    </aside>
  );
}
