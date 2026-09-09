# Filtered Water & Plumbing Services — Don Torcuato, Argentina

A local home-services business built end-to-end around a real, time-sensitive opportunity — market research, pricing, a live marketing site, print materials, and a growth strategy — designed and executed with Claude (Anthropic) as an AI collaborator throughout.

**Live site:** _add link here after deploying to Cloudflare Pages_

---

## The opportunity

In September 2026, the public water utility (AySA) began connecting homes in Don Torcuato — a neighborhood outside Buenos Aires — to the municipal water network for the first time. Many houses were switching from well/tank water to mains water, which created a narrow, high-intent window: while the street works were happening, homeowners were already thinking about their water connection, making it an easy moment to also offer point-of-use water filtration and related plumbing upgrades.

## What's in this project

- **Pricing & margin model** (Excel, formula-driven) — full bill-of-materials costing for a two-stage filter kit, four product tiers (from a filtered-water-only tap to premium 3-in-1 chrome/matte-black/flex faucets), a job-costing sheet for meter-to-house water connections, and a referral-program economics sheet that checks payout amounts against real margins before committing to them.
- **Landing page** (this repo) — a single-file, responsive, light/dark-theme-aware static site with real installation photography, an image lightbox/carousel, and a WhatsApp-based lead form (no backend required).
- **Print marketing** — a door-to-door double-sided flyer and two trifold brochures (water filtration, and a second one for complementary plumbing services), generated programmatically as print-ready PDFs, each carrying a QR code back to this site.
- **Growth strategy** — a two-sided referral program (discount for the referred customer, payout for the referrer) plus separate channels for local merchants and the crew doing the street excavation work, each modeled against the actual product margins to keep the economics sustainable.

## Working with AI

The business decisions — what to build, how to price it, what to say to a customer standing at their door — were mine. Claude was used conversationally throughout execution: writing the spreadsheet formulas, building and iterating the landing page, generating the print-ready PDFs, and catching things that needed fixing — including a flawed urgency claim in an early draft of the brochure copy that got corrected after review. Every deliverable went through multiple rounds of real feedback, not single-shot generation.

## Tech

- Python (`openpyxl`, `reportlab`, `Pillow`) for the spreadsheet and the print-ready PDFs
- Static HTML/CSS/JS for the landing page — no framework, no backend, no build step
- Cloudflare Pages for hosting

## Status

Live and running in Don Torcuato — first sales cycle in progress alongside the AySA connection works.
