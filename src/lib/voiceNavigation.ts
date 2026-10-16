const destinations = [
  {
    match: /\b(agri|samaj)\b/i,
    label: "Open Agri Samaj",
    href: "/work/agri-samaj-community-platform/",
  },
  {
    match: /\b(ugc|content studio)\b/i,
    label: "Open UGC Content Studio",
    href: "/work/ugc-platform/",
  },
  {
    match: /\b(lendflow|lending|banking)\b/i,
    label: "Open LendFlow",
    href: "/work/banking-saas/",
  },
  { match: /\bexperience\b/i, label: "View experience", href: "/#experience" },
  { match: /\bskills?\b/i, label: "View skills", href: "/#skills" },
  { match: /\bcontact\b/i, label: "Get in touch", href: "/#contact" },
  {
    match: /\b(projects?|work)\b/i,
    label: "Explore selected work",
    href: "/#projects",
  },
];

export function voiceDestination(question: string) {
  if (!/\b(show|open|take|navigate|go)\b/i.test(question)) return undefined;
  const destination = destinations.find((item) => item.match.test(question));
  return destination
    ? { label: destination.label, href: destination.href }
    : undefined;
}
