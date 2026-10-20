<h1 align="center">
  <img src="assets/mascot/momo_master_icon.svg" width="64" alt="MomoTTS logo"/><br/>
  MomoTTS
</h1>

<p align="center">
  <strong>The 100% on-device neural speech studio for Android.</strong><br/>
  Piper VITS &amp; Kokoro-82M voices · zero cloud · zero telemetry · zero invoices.
</p>

<p align="center">
  <a href="https://github.com/Bilal140202/momotts/releases/tag/v1.0"><img src="https://img.shields.io/badge/Release-v1.0%20(build%20106)-FF4D1C?style=flat-square&logo=android&logoColor=white" alt="Release v1.0"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-2E7D5B?style=flat-square" alt="License MIT"></a>
  <a href="https://bilal140202.github.io/momotts/"><img src="https://img.shields.io/badge/Site-GitHub%20Pages-0284C7?style=flat-square&logo=github&logoColor=white" alt="Site"></a>
  <a href="https://ansaribilal.com"><img src="https://img.shields.io/badge/Crafted%20by-Ansari%20Bilal-FF2E93?style=flat-square" alt="Ansari Bilal"></a>
  <img src="https://img.shields.io/badge/Telemetry-Zero-2E7D5B?style=flat-square" alt="Zero telemetry">
</p>

<p align="center">
  <a href="https://bilal140202.github.io/momotts/">Landing Site</a> ·
  <a href="https://bilal140202.github.io/momotts/download/">Download Hub</a> ·
  <a href="https://bilal140202.github.io/momotts/features/">Feature Deep-Dive</a> ·
  <a href="https://bilal140202.github.io/momotts/privacy/">Privacy Spec</a> ·
  <a href="#-repository-layout">Repo Layout</a>
</p>

---

## Table of Contents

- [What is MomoTTS?](#what-is-momotts)
- [Capability Matrix](#capability-matrix)
- [Engineering Architecture](#engineering-architecture)
- [The Audio Pipeline](#the-audio-pipeline)
- [Download & Verification (v1.0)](#download--verification-v10)
- [The Golden Hour Studio Design System](#the-golden-hour-studio-design-system)
- [Motion Inventory](#motion-inventory)
- [The Landing Site](#the-landing-site)
- [Running the Site Locally](#running-the-site-locally)
- [Deployment](#deployment)
- [Repository Layout](#repository-layout)
- [Release History](#release-history)
- [Contributing](#contributing)
- [Security](#security)
- [Creator & Philosophy](#creator--philosophy)
- [License](#license)

---

## What is MomoTTS?

MomoTTS is a studio-grade neural text-to-speech application engineered for Android. Every
stage of the pipeline — phonemization, neural acoustic synthesis, chunk rendering, and
master stitching — executes **inside your device's sandbox** using compiled ONNX runtimes.
There is no cloud call to make, no account to create, and no per-character meter to watch.

Where typical TTS services rent you a voice and log your library, MomoTTS hands you the
whole studio: twelve-plus high-definition neural voices across two engine families, an
unlimited-length document splitter, multi-character dialogue casting, and lossless export —
free, forever, and functional in airplane mode.

**Design personality.** The public site is built as *Golden Hour Studio* — warm paper
canvas, ink typography, tangerine-and-pink sunset duotone, and a cassette-album information
design where features are presented as numbered tracks. It shares zero visual DNA with
[MomoStack](https://bilal140202.github.io/momostack/)'s dark *Obsidian Editorial* system —
the two products read as siblings raised in different studios.

## Capability Matrix

| # | Capability | What it does | Hard guarantees |
|---|------------|--------------|-----------------|
| T-01 | **Smart Text Splitter** | Cuts long documents at natural sentence pauses; stitches one gapless master | Unlimited length; abbreviation-aware |
| T-02 | **Multi-Voice Dialogue Casting** | `NAME: line` scripts auto-cast distinct voices per character | Per-line re-render; saved cast presets |
| T-03 | **Neural Voice Hub** | 12+ built-in HD voices (Piper VITS + Kokoro 82M), on-demand downloads | Per-voice storage readout; 1-tap cache cleaner |
| T-04 | **Zero-Freeze Isolates** | All inference in background worker isolates | 60/120 FPS UI during synthesis |
| T-05 | **Studio Export** | WAV 16-bit / 24 kHz lossless + voice-tuned MP3 | Share-sheet native; NLE-ready files |
| T-06 | **Offline Sandbox** | Text, audio, models never leave the device | 0 bytes uploaded; airplane-mode first |

## Engineering Architecture

```
┌────────────────────────── Android App Process (sandboxed) ──────────────────────────┐
│                                                                                      │
│  Flutter UI layer  ──msg pass──▶  Background Isolate Pool                           │
│  (60/120 FPS, never blocks)       (parallel chunk synthesis)                        │
│                                          │                                           │
│                                          ▼                                           │
│                              Sherpa-ONNX native runtimes                             │
│                              ├── Piper VITS models   (MIT)                           │
│                              └── Kokoro-82M models   (Apache 2.0)                    │
│                                          │                                           │
│                                          ▼                                           │
│                    Chunk PCM  ──stitch──▶ Master WAV/MP3 ──▶ App-private storage    │
└──────────────────────────────────────────────────────────────────────────────────────┘
                    ▲                                              │
                    └── user-initiated voice downloads only ───────┘
                         (zero telemetry sockets, ever)
```

| Layer | Technology | Role |
|-------|-----------|------|
| UI | Flutter / Dart | Responsive studio interface, mascot state system |
| Concurrency | Dart isolates | Main thread never touches inference |
| Inference | Sherpa-ONNX | Compiled native neural graph execution |
| Voice family A | Piper VITS | Crisp, efficient narration voices |
| Voice family B | Kokoro 82M | Expressive, emotive lead voices |
| Persistence | Sandboxed SQLite + app-private cache | Projects, models, temp audio |

## The Audio Pipeline

1. **Paste anything.** Articles, EPUB excerpts, screenplays — no length ceiling.
2. **Split at natural pauses.** The splitter reads punctuation rhythm and avoids
   abbreviation traps ("Dr.", "e.g.", decimals), cutting where a human narrator would breathe.
3. **Synthesize in parallel.** Chunks render across background isolates; the UI keeps gliding.
4. **Stitch losslessly.** Chunks rejoin into a single gapless 24 kHz master — export one WAV
   or MP3 that sounds like a single continuous take.

## Download & Verification (v1.0)

Release **v1.0 (build 106)** ships three builds of the same application. Pick by hardware:

| Build | Recommended for | Size | SHA-256 |
|-------|-----------------|------|---------|
| `MomoTTS-arm64-v8a.apk` | **Modern devices (recommended)** | 50.7 MB | `8825e1a71e2d4682fa9e027a05dd34a9f7b86154a1fe7c55be38f61a0d17df94` |
| `MomoTTS-armeabi-v7a.apk` | Legacy 32-bit devices | 40.2 MB | `3c9fc7cf92d72ac4c1470827ade1d3ba99f8453badb3f928150c6383a357f465` |
| `MomoTTS-universal.apk` | One-file-fits-all bundle | 137.9 MB | `472bfa05d1d2d8940c133868b97089aacdb5fa2afb5411982ec1ad0625a5d2a3` |

| Property | Value |
|----------|-------|
| Version | `v1.0` (build 106) |
| Minimum OS | Android 8.0 (Oreo) |
| Engine | Sherpa-ONNX · Piper VITS · Kokoro 82M |
| Sample rate | 24 kHz · 16-bit |
| Accounts | None |
| Network use | Voice downloads only, user-initiated |

**Verify on Linux / macOS:**

```bash
sha256sum MomoTTS-arm64-v8a.apk        # Linux
shasum -a 256 MomoTTS-arm64-v8a.apk    # macOS
```

**Verify on Windows (PowerShell):**

```powershell
Get-FileHash .\MomoTTS-arm64-v8a.apk -Algorithm SHA256
```

Grab the APK from the [Download Hub](https://bilal140202.github.io/momotts/download/) or the
[GitHub Releases](https://github.com/Bilal140202/momotts/releases/tag/v1.0) page. A checksum
mismatch means the file is not the official build — do not install it.

## The Golden Hour Studio Design System

The site's visual language is documented here so future contributions stay coherent.

| Token | Value | Role |
|-------|-------|------|
| `--paper` | `#F7F2E9` | Warm canvas with SVG paper-grain overlay |
| `--paper-deep` | `#EFE7D6` | Alternating bands |
| `--ink` | `#1D1912` | Primary text, dark bands, footer wordmark stroke |
| `--tangerine` | `#FF4D1C` | Primary accent (sunset A) |
| `--pink` | `#FF2E93` | Secondary accent (sunset B, matches app brand) |
| `--amber` / `--leaf` | `#F2A61C` / `#2E7D5B` | Tertiary accents, positive states |

| Type role | Family | Notes |
|-----------|--------|-------|
| Display | **Fraunces** (variable, opsz 72) | Serif with italic accent words in tangerine/pink |
| Body | **Archivo** | 400–800, tight, warm |
| Labels/data | **Space Mono** | Uppercase, 0.12–0.16em tracking, "studio console" voice |

Information design: features are numbered **tracks** (`T-01…T-06`) inside an album
**tracklist**; sections are labeled **SIDE A / SIDE B**; the privacy section renders as a
printed **receipt**; the footer wordmark is outlined (stroke) rather than filled — a deliberate
contrast to MomoStack's solid obsidian wordmark.

## Motion Inventory

All motion is purposeful, themed around audio, and fully disabled under
`prefers-reduced-motion: reduce`:

- **Scroll tape** — gradient progress hairline (tape reel metaphor)
- **Hero line-mask entrance** — headline rises line by line, no preloader curtain
- **Canvas waveforms** — idle-breathing bars that pulse to speech energy (hero deck, playground, feature visual)
- **Web Speech API playground** — real in-browser synthesis with karaoke word highlighting driven by utterance boundary events
- **Tracklist hovers** — rows tint with a sunset gradient wash and dance a mini waveform
- **Voice previews** — per-card pitch/rate speech via `speechSynthesis`, busy-state guarded
- **Dialogue strip** — rotating "speaking" line with equalizer bars
- **Mascot polaroid switcher** — six moods with crossfade and rotating quotes
- **Counters** — quartic-eased numeric reveals on the stat strips
- **FAQ accordion** — single-open, height-animated
- **Voice ticker** — infinite console tape of voice names, pauses on hover

## The Landing Site

| Page | Path | Purpose |
|------|------|---------|
| Homepage | `index.html` | Hero + live deck, playground, tracklist, pipeline, voice hub, mascot, privacy receipt, download CTA |
| Features | `features/` | Six-track deep dive with spec tables and the live casting strip |
| Download | `download/` | Three builds, install guide, full checksums, sideload FAQ |
| Privacy | `privacy/` | The zero-exfiltration specification (COPPA/GDPR notes, storage classification, attributions) |
| About | `about/` | Creator story, philosophy tracklist, discography |

Every page ships: canonical URLs, Open Graph / Twitter cards, `SoftwareApplication`
JSON-LD (homepage), mobile sheet navigation, scroll-tape progress, and the shared
`main.css` / `main.js` engine. Visible outbound links point only to
[ansaribilal.com](https://ansaribilal.com) — GitHub URLs appear solely as functional
release-asset download endpoints.

## Running the Site Locally

The site is fully static — any file server works. No build step, no dependencies.

```bash
git clone https://github.com/Bilal140202/momotts.git
cd momotts

# Any one of these:
python3 -m http.server 8080          # Python
npx serve .                          # Node
php -S localhost:8080                # PHP
```

Open `http://localhost:8080`. The playground and voice previews use the browser's built-in
speech engine — Chrome, Edge, and Safari expose the richest voices.

## Deployment

The site deploys automatically to **GitHub Pages** via
`.github/workflows/deploy.yml` (`actions/deploy-pages@v4`) on every push to `main`.
Live URL: **https://bilal140202.github.io/momotts/**

Netlify is unnecessary: the site is pure static with no build step, and Pages'
push-to-deploy pipeline removes any need for an external host.

## Repository Layout

```
momotts/
├── index.html                          # Homepage — hero deck, playground, tracklist, hub, receipt, CTA
├── features/
│   └── index.html                      # Six-track deep dive + spec tables
├── download/
│   └── index.html                      # Builds, install guide, checksums, FAQ
├── privacy/
│   └── index.html                      # Zero-exfiltration specification
├── about/
│   └── index.html                      # Creator story, philosophy, discography
├── assets/
│   ├── css/main.css                    # Golden Hour Studio system (~1,070 lines, single source of truth)
│   ├── js/main.js                      # Motion + speech engine (~460 lines)
│   └── mascot/                         # Momo SVG suite (7 vectors incl. master icon)
├── .github/workflows/deploy.yml        # Pages deployment
├── CHANGELOG.md                        # Keep-a-Changelog history
├── CONTRIBUTING.md                     # Contribution protocol
├── SECURITY.md                         # Security policy & checksum verification
├── AGENTS.md                           # AI-agent conventions for this repository
├── LICENSE                             # MIT + third-party attributions
└── README.md                           # This document
```

## Release History

See [CHANGELOG.md](CHANGELOG.md) for the full history. Current release:

- **v1.0 (build 106)** — First stable release on this repository: three verified APK builds,
  the Golden Hour Studio landing site with a live Web-Speech playground, and the complete
  zero-exfiltration documentation set.

## Contributing

Contributions are welcome — read [CONTRIBUTING.md](CONTRIBUTING.md) first. The short version:
open an issue before large changes, keep the zero-telemetry guarantee sacred (no analytics or
tracking dependencies will ever be merged), and match the Golden Hour Studio tokens when
touching the site.

## Security

Read [SECURITY.md](SECURITY.md) for the disclosure policy and the user-facing checksum
verification ritual. The site itself ships no JavaScript beyond first-party motion and the
browser speech API — no third-party scripts, fonts served by Google Fonts only.

## Creator & Philosophy

Engineered with first-principles stubbornness by **Ansari Bilal (Bilal Ansari)**.

- Personal site: **[ansaribilal.com](https://ansaribilal.com)**

> Offline is a feature, not a fallback. The sandbox is the contract. A tool that makes you
> wait is a tool you'll quietly stop using. Craft ships free.

## License

The site and documentation are released under the [MIT License](LICENSE). Third-party
components remain under their respective licenses: Sherpa-ONNX (Apache 2.0), Piper VITS
tooling and models (MIT), Kokoro-82M (Apache 2.0) — see the
[privacy specification](https://bilal140202.github.io/momotts/privacy/) section 6 for
attributions.
