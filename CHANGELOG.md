# Changelog

All notable changes to the MomoTTS public site and release distribution are documented
in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Dark "studio session" theme variant (warm paper remains the default).
- Lighthouse CI workflow with performance budgets.
- Interactive voice-catalog browser wired to real build manifests.
- Per-release checksum badges on the download hub.

---

## [1.0] — 2026-10-20

The debut of the MomoTTS public home on `Bilal140202/momotts`: the official landing site,
the complete documentation set, and the verified v1.0 (build 106) APK distribution.

### Added — Release Distribution

- GitHub Release **v1.0** carrying three SHA-256-verified builds of the Android app
  (source: `hamza140202/momo-tts-app` build 106):
  - `MomoTTS-arm64-v8a.apk` — 50,684,559 bytes — recommended for modern devices
  - `MomoTTS-armeabi-v7a.apk` — 40,218,073 bytes — legacy 32-bit devices
  - `MomoTTS-universal.apk` — 137,899,608 bytes — universal bundle
  - `SHA256SUMS.txt` — checksum manifest for all three
- Download hub with build-selector cards, a three-step sideload guide, full per-asset
  checksum blocks with one-tap copy, and platform verification commands.

### Added — Landing Site ("Golden Hour Studio")

- Warm-paper editorial design system: `#F7F2E9` canvas with SVG paper grain, ink
  typography, tangerine `#FF4D1C` / pink `#FF2E93` sunset duotone, Fraunces display serif,
  Archivo body, Space Mono console labels.
- Cassette-album information design: features as numbered tracks (T-01…T-06), sections
  labeled SIDE A / SIDE B, privacy rendered as a printed receipt with barcode, outlined
  footer wordmark.
- **Live Web Speech API playground** — real in-browser synthesis with engine/voice
  selection, speed control, utterance-boundary karaoke word highlighting, and a canvas
  waveform that pulses to speech energy.
- Hero console cassette deck with breathing canvas waveform and a play button that
  speaks rotating studio lines.
- Voice Hub cards (Heart, Bella, Amy, Ryan, Jenny +7) with per-card pitch/rate audio
  previews through the browser engine.
- Animated four-stage splitter pipeline; album-style tracklist with sunset hover washes
  and dancing mini-waveforms; mascot polaroid mood switcher (six expressions with quotes).
- Full subpage set: features deep-dive, download hub, zero-exfiltration privacy spec,
  creator story.
- Complete motion engine with `prefers-reduced-motion` guards and touch-conscious
  degradation; single shared `main.css`/`main.js` across all pages.
- SEO foundation: canonical URLs, Open Graph/Twitter cards, `SoftwareApplication` JSON-LD.

### Added — Repository Infrastructure

- Automated GitHub Pages deployment via `actions/deploy-pages@v4` on push to `main`.
- Contribution workflow (`CONTRIBUTING.md`), security policy (`SECURITY.md`),
  release history (this file), AI-agent conventions (`AGENTS.md`), MIT `LICENSE`
  with third-party engine attributions, `.gitignore`.

### Design Decisions

- **Deliberate divergence from MomoStack.** The sister product's site uses a dark
  "Obsidian Editorial" system (obsidian canvas, indigo accent, Space Grotesk, glass
  panels, custom cursor, preloader). MomoTTS adopts a light "Golden Hour Studio"
  language (paper canvas, sunset duotone, Fraunces, receipt/track metaphors, no custom
  cursor, no preloader) so the two landing pages never read as templates of each other.
- **Real interactivity over mockups.** The site's demo is a functioning speech engine
  (Web Speech API), not a screenshot — proof-of-philosophy for an app about speech.
- **GitHub Pages over Netlify.** Pure static with no build step; Pages' push-to-deploy
  removes any need for an external host.

[Unreleased]: https://github.com/Bilal140202/momotts/compare/v1.0...HEAD
[1.0]: https://github.com/Bilal140202/momotts/releases/tag/v1.0
