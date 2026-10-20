# Contributing to MomoTTS

Thanks for wanting to make the studio better. This repository holds the **public site and
release distribution** for MomoTTS — landing pages, documentation, and the verified APK
release channel. Read this file before opening a pull request; it keeps reviews fast and
the product coherent.

## Ground rules

1. **Zero telemetry is sacred.** No analytics SDKs, tracking pixels, third-party scripts,
   or "anonymous" beacons will ever be merged — in the site or the docs. First-party
   JavaScript only. Google Fonts is the sole external resource.
2. **Open an issue first.** Substantive changes (new pages, new sections, design-system
   additions) start as an issue so we can agree on the shape before code exists.
3. **Match the design system.** The site speaks *Golden Hour Studio* — warm paper canvas,
   ink typography, tangerine/pink sunset duotone, Fraunces/Archivo/Space Mono. Use the
   existing tokens in `assets/css/main.css`; do not introduce new one-off colors or fonts.
4. **Keep it accessible.** Interactive elements need focus states and keyboard paths;
   decorative motion gets `aria-hidden`; everything must survive
   `prefers-reduced-motion: reduce`.
5. **Facts stay checkable.** Version numbers, byte sizes, and checksums must match the
   published release exactly. If you touch download data, re-verify the SHA-256 values.

## Local workflow

```bash
git clone https://github.com/Bilal140202/momotts.git
cd momotts
python3 -m http.server 8080
# open http://localhost:8080
```

There is no build step. Edit, refresh, compare.

## Commit style

Use imperative, present-tense subjects with a scope prefix:

```
feat: add voice-catalog browser to the hub page
fix: correct universal APK byte count in download hub
docs: expand AGENTS.md motion rules
design: tighten track-row hover timing
```

Keep commits atomic — one idea per commit — and rebase before opening the PR.

## Pull request checklist

- [ ] Issue linked and discussed
- [ ] Visuals match the Golden Hour Studio tokens
- [ ] Tested at 1440px and 390px widths
- [ ] `prefers-reduced-motion` behavior verified for any new motion
- [ ] No new external resources introduced
- [ ] Docs (README/CHANGELOG) updated when behavior or releases change

## What we do not accept

- Analytics, trackers, or third-party JS of any kind
- Screenshots-as-UI (the playground must remain a real, working demo)
- AI-generated filler copy — write like a person who uses the app
- Design drift toward dark/neon/glass — that is the other studio's language

## Reporting problems

Security issues follow the disclosure process in [SECURITY.md](SECURITY.md). Site bugs
and content corrections are normal issues.
