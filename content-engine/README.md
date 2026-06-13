# DV Content Engine — "I hate socials" edition

Goal: keep the Digital Vision Wix apps visible on social **without living on social**.
You touch this ~**15 minutes a week**. Everything else runs on autopilot.

This is a *system*, not a one-off batch. The flow:

```
generate copy + visuals  →  bulk-import once  →  scheduler drips it out  →  you skim replies weekly
   (Claude + Canva)            (CSV upload)         (Publer/Metricool)         (~15 min/wk)
```

---

## What's in here

| File | What it is |
|------|------------|
| `README.md` | This playbook — how the autopilot runs. |
| `content-system.md` | The strategy: content pillars, post formulas, hook bank, repurposing rules. The "why" behind the posts. |
| `posts.md` | The content bank — ready-to-post copy per app, for X + LinkedIn, plus DeepFrame video scripts. |
| `schedule.csv` | A 4-week calendar you import into a scheduler in one go. |
| `regenerate.md` | The prompt to paste back to Claude to refill the bank for the next month. |

---

## How automatable is it, really?

| Task | Automatable? | Notes |
|------|-------------|-------|
| Writing posts / calendars | ✅ Fully | Claude generates the bank; see `regenerate.md`. |
| Designing the graphics | ✅ Fully | Canva (wired into this workspace) generates the post images. DeepFrame shader output = your unfair advantage on video. |
| Scheduling / publishing | ✅ Fully | Buffer / Publer / Metricool auto-publish on a queue. |
| Recycling top posts | ✅ Fully | Publer/Metricool "evergreen" auto-reposts winners. |
| **Replies & DMs** | ⚠️ Manual (~5 min/day) | Platforms throttle/shadowban pure bots, and the algorithm rewards real replies. This is the one part to keep human. |
| Instagram / TikTok publish | ⚠️ One tap | Their APIs need a manual confirm on the phone for Reels/TikTok. Schedule it, then tap "share" when notified. |

**Bottom line: ~85% hands-off.** The only irreducible human bit is replying, and even that is ~5 min/day.

---

## One-time setup (≈30 min, once)

1. **Pick a scheduler** (free tiers are enough to start):
   - **Publer** — best free tier, CSV bulk import, evergreen recycling. *Recommended.*
   - **Metricool** — strong analytics + CSV import, good for LinkedIn.
   - **Buffer** — simplest, but free plan is limited.
2. Connect your **X** and **LinkedIn** accounts (personal LinkedIn profile out-reaches the company page ~5–7x — post as Pete, not as the DV page).
3. Import `schedule.csv`.
4. Generate the graphics (ask Claude: *"generate the Canva visuals for this month's posts"*) and attach them in the scheduler.
5. Turn on the queue. Done.

## Weekly routine (≈15 min)

- **Mon (10 min):** skim last week's numbers; toggle the 2 best posts to "recycle/evergreen."
- **Any day (5 min/day, optional):** reply to comments/DMs. Keep it human and short.
- **End of month (2 min):** paste `regenerate.md` to Claude → get next month's bank → re-import.

---

## Cadence (what the schedule does)

- **5 posts/week** total, Mon–Fri, no weekends (B2B audience).
- Rotates across apps so no single app spams the feed.
- Mix per week: 2 value/educational · 1 build-in-public · 1 product · 1 DeepFrame visual.
- Same core idea is reshaped for X (punchy) and LinkedIn (story) — never identical cross-posts.

> Start at 5/week. If it's working and you don't hate it, bump to daily by turning on recycling — zero extra writing.
