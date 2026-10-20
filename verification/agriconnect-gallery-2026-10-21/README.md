# AgriConnect portfolio gallery

Verified on 21 October 2026 (Asia/Kolkata).

The featured AgriConnect card and its existing case study now share a four-view screenshot gallery. The administrator overview is the initial view. The other views show TOTP security status, catalogue moderation, and a live AI response explaining the Photo-sell listing workflow.

## Capture provenance

All four JPEGs are real captures from the deployed AgriConnect application in the user's authenticated Chrome session. No generated interface images, staged dashboard values, or edited DOM were used.

| File in `public/evidence/` | Deployed screen | Dimensions |
| --- | --- | --- |
| `agri-connect-admin.jpg` | `/admin/control-centre` | 1901 × 910 |
| `agri-connect-security.jpg` | `/admin/control-centre/security` | 1900 × 855 |
| `agri-connect-catalogue.jpg` | `/admin/control-centre/products` | 1901 × 910 |
| `agri-connect-assistant.jpg` | Public marketplace assistant | 380 × 465 |

Source origin: https://agri-connect-flame.vercel.app

The security capture stops above verification inputs and actions. No authenticator secrets, enrollment QR codes, recovery-code values, or verification values are included. The assistant capture is limited to its panel and a synthetic product-listing question. Regional management and employee records were excluded. No account settings, permissions, listings, or orders were changed.

The security screen displays illustrative charts and posture scores; the gallery caption states that these are not independent security results. Dashboard totals represent application records, not commercial adoption or revenue achievements. The existing 1,642-record migration statement is preserved; no new business-impact metrics were added. This portfolio update is not a security certification or a production-readiness audit of AgriConnect.

## Validation

- TypeScript, ESLint, and the production/prerender build passed.
- 130 regression tests passed, including text/voice API and quota behavior.
- 32 prerender checks passed, including the new gallery assets, JPEG signatures, public URLs, full-size image links, ARIA targets, and initial selection.
- Chrome loaded all four gallery images and matching enlargement links. Home and ArrowRight keyboard navigation selected the expected panels.
- Responsive layout checks at mobile and desktop widths found one visible gallery panel and no horizontal page overflow. Temporary browser viewport overrides were reset.
- The existing project-detail route rendered the same gallery and complete stack/features.
- The live AgriConnect assistant answered a public question about listing products. No listing was submitted.
- The portfolio's required real-provider release evaluation passed 48/48 responses and 8/8 retrieval checks. `evaluation.json` records the current runtime fingerprint; the older audit report was preserved.

Screenshot SHA-256 hashes are recorded in `screenshots.json`. GitHub delivery and the resulting deployment are verified separately after commit.
