export const agriConnectGallery = [
  {
    id: "admin",
    label: "Admin dashboard",
    src: "/evidence/agri-connect-admin.jpg",
    alt: "AgriConnect administrator dashboard with platform navigation and operational overview",
    width: 1901,
    height: 910,
    description:
      "An operations workspace with platform totals, order-status breakdowns, review queues, and permission-controlled administration. Displayed totals are application records, not adoption metrics.",
  },
  {
    id: "security",
    label: "2FA & security",
    src: "/evidence/agri-connect-security.jpg",
    alt: "AgriConnect admin security interface with two-factor authentication controls",
    width: 1900,
    height: 855,
    description:
      "Enabled TOTP authenticator status, session controls, and authentication-event navigation. The interface's charts and posture scores are illustrative, not independent security results.",
  },
  {
    id: "catalogue",
    label: "Catalogue operations",
    src: "/evidence/agri-connect-catalogue.jpg",
    alt: "AgriConnect product moderation and catalogue screen with search, category filters, stock, approval status, and placement controls",
    width: 1901,
    height: 910,
    description:
      "Search and filter the catalogue, inspect stock and moderation status, and manage marketplace placements in a dedicated admin interface.",
  },
  {
    id: "assistant",
    label: "AI assistance",
    src: "/evidence/agri-connect-assistant.jpg",
    alt: "Live AgriConnect AI assistant answering how to list a product using the Photo-sell workflow",
    width: 380,
    height: 465,
    description:
      "A live response guides a seller through Photo-sell and product-listing steps. The assistant explains the workflow without publishing a listing on the user's behalf.",
  },
] as const;
