# Live Frame — Meta Glasses

**Update your Wix site by talking to your Ray-Ban Meta glasses.**

> _"Hey Meta, send a photo to my website"_ → the photo appears live on your Wix
> site a few seconds later. Hands-free. No phone taps.

This is a standalone proof-of-concept, separate from the `velo-hooks` library in
the parent folder. It reuses the same reactive front-end idea (Solid.js-style
state binding) but adds the Velo backend + WhatsApp bridge that make the gimmick
work end-to-end.

---

## Why a bridge (read this first)

Ray-Ban Meta glasses have **no public developer API** — you cannot read photos
off the device or trigger capture from your own code. The one output channel
that is fully **voice-driven and hands-free** is *sharing*, and the glasses can
share a photo over **WhatsApp** by voice.

So we route through WhatsApp's official Business (Cloud) API instead of talking
to the glasses directly. This is a **bridge, not a native Meta integration** —
fine for a demo/marketing piece, just don't market it as an official Meta
partnership.

## The flow

```
🕶️  "Hey Meta, send a photo to My Website"      (glasses, voice only)
        │  WhatsApp voice send
        ▼
📩  WhatsApp Cloud API  →  webhook POST to Wix          (backend/http-functions.js)
        │
        ▼
⚙️  Download media from Graph API                       (backend/whatsapp.js)
        │
        ▼
📦  Media Manager upload  +  Data collection row        (backend/media.js)
        │
        ▼
🖥️  Wix page — velo-hooks bindRepeater  →  photo appears live   (pages/liveGallery.js)
```

## What's in here

| File | Role |
| --- | --- |
| `backend/http-functions.js` | WhatsApp webhook: GET verify + POST receive |
| `backend/whatsapp.js` | Fetch/download media from the WhatsApp Graph API |
| `backend/media.js` | Upload to Wix Media Manager, write + query the collection |
| `backend/gallery.web.js` | Web method the page calls to read the live feed |
| `pages/liveGallery.js` | velo-hooks live gallery that updates automatically |
| `docs/setup.md` | Step-by-step: WhatsApp app, secrets, collection, deploy |

## Quick start

1. Read `docs/setup.md` and create the Wix Data collection + secrets it lists.
2. Paste each `backend/*` file into the matching backend file in your Wix site.
3. Paste `pages/liveGallery.js` into your gallery page's code.
4. Point the WhatsApp Cloud API webhook at your site's `/_functions/whatsapp`.
5. Say _"Hey Meta, send a photo to My Website"_ and watch the page.

## Status

Proof-of-concept scaffold. The code is written to Wix Velo conventions and is
meant to be dropped into a Wix site (Velo/Wix Studio). It is not a runnable
Node app on its own — Wix hosts the backend and pages.
