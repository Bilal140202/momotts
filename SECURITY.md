# Security Policy

MomoTTS treats privacy as an architectural property, and security the same way: verified
artifacts, minimal surface, and fast disclosure.

## Supported channel

| Channel | Status |
|---------|--------|
| Release **v1.0** (build 106) | ✅ Supported — security fixes target this line |
| Older builds from other repositories | ⚠️ Use only for legacy hardware; upgrade to v1.0 |

## Reporting a vulnerability

Email **security@ansaribilal.com** (or open a GitHub Security Advisory on this repository)
with reproduction steps and affected pages/assets. Do not open public issues for
exploitable findings.

- **Day 0** — acknowledgement of your report.
- **Day 7–30** — fix developed and internally verified.
- **Day 30–90** — coordinated release plus public credit (opt-in) in the release notes.

We practice coordinated disclosure and will credit your work unless you prefer anonymity.

## Scope

In scope: this repository's static site (all pages under
`https://bilal140202.github.io/momotts/`), the release distribution channel (tag `v1.0`
and its assets), and the documentation set.

The Android application itself is distributed from this repo's releases; findings specific
to app internals may be coordinated here and routed to the engineering bench.

## Verification Instructions for Users

Before installing any MomoTTS APK, verify its SHA-256 checksum against the values
published on the [Download Hub](https://bilal140202.github.io/momotts/download/), in
[SHA256SUMS.txt](https://github.com/Bilal140202/momotts/releases/download/v1.0/SHA256SUMS.txt),
and in the release notes:

```bash
sha256sum MomoTTS-arm64-v8a.apk
```

| Asset | SHA-256 |
|-------|---------|
| `MomoTTS-arm64-v8a.apk` | `8825e1a71e2d4682fa9e027a05dd34a9f7b86154a1fe7c55be38f61a0d17df94` |
| `MomoTTS-armeabi-v7a.apk` | `3c9fc7cf92d72ac4c1470827ade1d3ba99f8453badb3f928150c6383a357f465` |
| `MomoTTS-universal.apk` | `472bfa05d1d2d8940c133868b97089aacdb5fa2afb5411982ec1ad0625a5d2a3` |

A mismatch means the file is not the official build — do not install it, and please
report where you obtained it.

## Site surface statement

The landing site is fully static with first-party JavaScript only: motion engines and the
Web Speech API demo. There are no cookies, no forms, no server-side code, no third-party
scripts, and no persistent storage of visitor data. The attack surface for visitors is
deliberately near-zero — report anything that suggests otherwise.
