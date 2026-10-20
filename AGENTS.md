# AGENTS.md — Conventions for AI Agents Working on MomoTTS

This repository hosts the public site, documentation, and release channel for **MomoTTS**,
the 100% on-device neural speech studio for Android. If you are an AI agent (or a human
following agent conventions) editing this repo, these are the house rules.

## Product facts you must not corrupt

- Product name: **MomoTTS** (the app), "Momo TTS Studio" (the imprint). Landing voice
  calls the mascot **Momo**.
- Creator: **Ansari Bilal** (Bilal Ansari) — canonical link is
  [https://ansaribilal.com](https://ansaribilal.com).
- Engine stack: **Flutter / Dart isolates / Sherpa-ONNX / Piper VITS / Kokoro-82M**,
  24 kHz · 16-bit audio.
- Current release: **v1.0 (build 106)** with three builds (arm64-v8a 50.7 MB,
  armeabi-v7a 40.2 MB, universal 137.9 MB) and published SHA-256 values.
- Privacy claim, verbatim spirit: **zero exfiltration** — text, audio, and models never
  leave the device; network is used only for user-initiated voice downloads.

Never invent versions, byte sizes, checksums, or voice counts. Every distribution number
on the site must match `SHA256SUMS.txt` and the release tag exactly.

## Link policy

- Visible outbound links point to **ansaribilal.com only** (plus internal pages).
- GitHub URLs appear solely as **functional release-asset endpoints**
  (`/releases/download/...`) — never as visible "GitHub page" links in nav, footer, or
  body copy.
- The MIT license is linked to `opensource.org/licenses/MIT`.

## Design system — Golden Hour Studio

This site must remain visually distinct from the sister product MomoStack (dark
"Obsidian Editorial": obsidian canvas, indigo accent, glass panels, custom cursor,
preloader curtain). Do **not** import MomoStack patterns. Golden Hour Studio means:

- Light warm paper (`--paper: #F7F2E9`) with SVG grain; ink text (`--ink: #1D1912`).
- Sunset duotone accents: tangerine `#FF4D1C` + pink `#FF2E93`; amber/leaf as tertiary.
- Fraunces (display, italic accent words), Archivo (body), Space Mono (uppercase labels).
- Information design as a **record**: tracks T-01…T-06, SIDE A/B, receipt/barcode for
  privacy, outlined footer wordmark.
- No preloader curtain, no custom cursor, no magnetic buttons, no glassmorphism.

All styles live in `assets/css/main.css`; all behavior in `assets/js/main.js`. Both are
shared by every page — extend them, never fork per-page copies.

## Motion rules

- Every animation needs a purpose and a `prefers-reduced-motion` fallback
  (the CSS blanket in `main.css` handles most cases; JS gates with `prefersReduced`).
- Canvas waveforms pulse to speech energy via the shared `makeWave`/`pulseAll` helpers.
- New interactive elements must be keyboard-reachable and `aria`-labeled.

## Speech playground rules

- The playground uses the **Web Speech API** (`speechSynthesis`) — it is a real demo,
  not a mock. Keep boundary-driven word highlighting intact.
- Guard every speech call: check for API presence (`no-tts` class path), cancel
  previous utterances, and reset UI state on `onend`/`onerror`.
- Voice previews per card use `data-say`, `data-pitch`, `data-rate` — keep them
  declarative.

## Docs rules

- Keep `README.md`, `CHANGELOG.md`, `SECURITY.md`, and the download page consistent:
  same version string, same byte sizes, same checksums everywhere.
- Changelog follows Keep-a-Changelog 1.1.0; site releases are tagged `vX.Y`.
- Write docs like a senior engineer who respects the reader: concrete numbers, no hype
  adjectives, no emoji in site UI copy (SVG icons only; emoji remain exclusive to
  in-app product surfaces).

## Verification before pushing

1. `python3 -m http.server 8080` and walk every page.
2. Check console for errors (all pages).
3. Test at 1440px and 390px; exercise the playground, mood switcher, FAQ, mobile sheet.
4. Grep for stale version/checksum strings after any release change.
5. Confirm every visible external link resolves to ansaribilal.com.
