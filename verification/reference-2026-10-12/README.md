# Reference portfolio review — 12 October 2026

Reference: https://www.yashmahamulkar.dev/

Decision confirmed by Harsh: **keep the light/blue identity, add richer project visuals and an AI assistant**. This is a review and adaptation brief; no portfolio implementation or deployment is claimed by this report.

## Scope and method

Reviewed the public single-page portfolio through the Codex in-app browser at desktop (1440 × 1000) and mobile (375 × 812) viewport sizes. Used rendered screenshots, accessibility/DOM observations, and public interactions. No login, private source access, external demo audit, résumé download, or email submission. Employment and performance figures are the author's claims, not independently verified facts.

## Journey and findings

1. **Hero and navigation.** The black/orange space identity, rotating role title, social links, and persistent AI launcher establish a recognizable theme. The primary “Explore My Work” link targets experience rather than projects, making the label less predictable. Desktop captures had a large empty visual area; the mobile hero displayed a black-hole illustration. Console output contained a Three.js NaN bounding-sphere error. That is an observed runtime issue in this session, not proof of universal failure or its cause. Evidence: `01-hero-desktop.png`, `12-mobile-hero.png`.
2. **About.** Location, education, expandable biography, certifications, open-source references, social links, and résumé action supply useful credibility. Read more expanded the biography and exposed Show less. The expanded version becomes dense. Evidence: `05-about.png`, `06-about-expanded.png`.
3. **Experience.** A vertical timeline and consistent company/role/date hierarchy make career progression clear. Bullets describe concrete engineering work and claimed outcomes. Several entries are long; a short summary followed by expandable detail would be easier to scan. Evidence: `07-experience.png`.
4. **Skills.** Five categories divide the stack into Languages, Web & Frameworks, AI / ML, Cloud & DevOps, and Databases. Selecting AI / ML replaced language tiles with the corresponding tools. Logos improve recognition, but skills still benefit from links to project evidence. Evidence: `08-skills.png`.
5. **Projects and footer.** Nine visual cards combine preview images, title, short description, stack labels, status, and source/demo actions. This is the strongest transferable pattern. The lower project row and footer retain predictable social/explore/contact links. Evidence: `09-projects.png` (lower grid and footer, despite filename).
6. **Project detail.** Opening ReScapeAI displayed a case-study overlay with a large preview, project links, technical highlights, stack, and brief. Escape dismissed it, verified after its transition completed. This balances a compact gallery with deeper technical detail. The triggering card initially retained focus; the captured DOM did not expose a dialog role. Focus management and semantics require attention in Harsh's version. Evidence: `10-project-detail.png`.
7. **AI terminal.** The launcher opened a terminal-style overlay with boot text, listed commands, and a job-description fit suggestion. `/help` returned commands for about, experience, skills, projects, contact, résumé, certifications, open source, help, and clear. A natural-language project recommendation query showed waiting/disabled input and did not produce a response during the observation window. Closing and reopening returned to the introduction. The displayed “specialist agents” text does not prove backend architecture, model, or provider. Evidence: `02-chatbot-ready.png`, `03-chatbot-help.png`, `04-chatbot-response-state.png`.
8. **Mobile.** The hamburger exposed navigation and social links; selecting Home closed the menu. The hero became a single-column composition. The terminal used nearly the full viewport, appropriate for a phone, but its long placeholder was clipped and its textbox had no explicit aria-label in the inspected DOM. The sampled page width did not exceed the 375px viewport. Evidence: `11-mobile-menu.png`, `12-mobile-hero.png`, `13-mobile-assistant.png`.

## Adaptation for Harsh

| Area | Recommended direction |
| --- | --- |
| Identity | White and soft-blue surfaces, existing blue accent, subtle borders, restrained shadows, consistent rounded corners. |
| Hero | A stable professional headline, concise value proposition, portrait, selected-work action, résumé action, and a clearly named assistant entry. |
| Selected projects | Image-first cards with a concise problem/solution summary, existing stack data, real source/demo links, and a clearly named case-study action. |
| Case studies | Preserve existing overview, contribution, features, challenge, outcome, and walkthrough content in a readable detail experience. |
| Archive | Preserve all 26 projects and current search/filter functionality. Avoid copying reference projects or unsupported outcome metrics. |
| Experience | Compact role/date hierarchy with real responsibilities and only existing supported achievements. |
| Skills | Categories that make the stack easier to scan and connect skills to relevant work. |
| Assistant | A calm conversational interface with suggested prompts, readable responses, project links, résumé/contact shortcuts, and visible loading/error/retry states. Ground answers in Harsh's public portfolio content. |
| Interaction quality | Keyboard-accessible overlays, focus restoration, explicit field labels, reduced-motion support, touch-friendly controls, and responsive layouts. |

Current source comparison: `src/components/Work.tsx` already contains detailed project explanations and walkthroughs, while `src/data/portfolio.ts` and `projects.json` hold the portfolio knowledge. The improvement is presentation and discoverability plus a new genuine AI capability; the existing rich content should not be discarded.

## Verification limits

- Reference AI natural-language generation and recruiter-fit assessment were not verified successfully. No provider, prompt, knowledge source, multi-agent implementation, or retention policy can be inferred from its interface.
- Desktop/mobile sampling is not a full browser/device matrix. Mobile on-screen keyboard behavior was not tested.
- DOM observations identify accessibility risks; this was not an automated WCAG certification or assistive-technology audit.
- External project demos, repositories, résumé contents, email delivery, deployment configuration, and private analytics were outside this public-page review.
- `02-chatbot-open.png` is an initial loading state and is not accepted as a finished UI. `04-chatbot-answer.png` records waiting, not an answer. Some filenames reflect intended capture destinations; the evidence references above identify the actual accepted content.

## Delivery state

The visual direction is confirmed. This report and screenshots are local audit artifacts. No application source has been modified in this analysis pass, and no new commit or push has been performed. AI credentials/provider access must be resolved before implementing and verifying real generated responses.
