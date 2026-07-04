# Setup — Live Frame Meta Glasses

End-to-end setup for the voice → WhatsApp → Wix demo. Budget ~1–2 hours plus
WhatsApp Business review time (usually instant for test numbers).

---

## 1. Wix side

### 1a. Data collection
Create a collection named **`LiveFramePhotos`** with fields:

| Field key | Type | Notes |
| --- | --- | --- |
| `title` | Text | caption / label |
| `image` | Image | the uploaded photo |
| `source` | Text | always `meta-glasses` for now |
| `fromNumber` | Text | sender's WhatsApp number |
| `whatsappMessageId` | Text | dedupe key |
| `receivedAt` | Text (ISO) | sort key for the feed |

Permissions: allow the site to read/write from backend (the code uses
`suppressAuth: true`, so backend writes work regardless; set **read** to
*Anyone* if you want the gallery public).

### 1b. Secrets (Secrets Manager)
Add three secrets:

| Secret name | Value |
| --- | --- |
| `WHATSAPP_VERIFY_TOKEN` | any random string you invent; you'll paste the same one into Meta |
| `WHATSAPP_ACCESS_TOKEN` | the WhatsApp Cloud API access token |
| `WHATSAPP_PHONE_NUMBER_ID` | (optional, for replies) your WhatsApp phone number id |

### 1c. Code
- Backend: paste `backend/http-functions.js`, `backend/whatsapp.js`,
  `backend/media.js`, `backend/gallery.web.js` into the matching backend files.
- Frontend: paste `pages/liveGallery.js` into the gallery page's code panel.
- Install the `velo-hooks` package (Wix Editor → Packages → npm → `velo-hooks`).
- Add the page elements listed in `pages/liveGallery.js` and match the IDs.

Publish the site. Your webhook endpoint is now:
```
https://<your-domain>/_functions/whatsapp
```

---

## 2. WhatsApp Cloud API side

1. Create a Meta developer app at https://developers.facebook.com → add the
   **WhatsApp** product. A free test phone number is provided.
2. Copy the temporary **access token** and **phone number id** into the Wix
   secrets above. (For production, generate a permanent System User token.)
3. Under **WhatsApp → Configuration → Webhook**, click **Edit**:
   - Callback URL: `https://<your-domain>/_functions/whatsapp`
   - Verify token: the exact string you stored in `WHATSAPP_VERIFY_TOKEN`
   - Click **Verify and save** → this triggers the `get_whatsapp` handshake.
4. **Subscribe** to the `messages` field.
5. Add your own phone as a recipient (test numbers only message approved
   recipients until the app is live).

---

## 3. The glasses

1. In the WhatsApp app, save the WhatsApp Business number as a contact named
   **My Website** (or whatever wake-phrase you like).
2. Make sure the glasses are paired and WhatsApp is the selected messaging app
   in the Meta AI app settings.
3. Say: **"Hey Meta, send a photo to My Website."**
4. Watch the gallery page — the photo lands within a few seconds.

---

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Webhook won't verify | `WHATSAPP_VERIFY_TOKEN` mismatch, or site not published |
| 200 but no photo | not subscribed to `messages`, or sender not an approved recipient |
| Image row but broken image | collection `image` field type isn't Image, or upload failed — check logs |
| Duplicates | `whatsappMessageId` field missing/misspelled (dedupe relies on it) |
| Nothing on the page | element IDs don't match `pages/liveGallery.js`; check the browser console |

## Going from demo → real

- **Push instead of poll:** replace the `setInterval` in `liveGallery.js` with a
  `wix-realtime` subscription published from `saveIncomingPhoto`.
- **Moderation:** add an `approved` boolean to the collection and filter the feed
  so a human OKs photos before they go on the wall.
- **Captions by voice:** WhatsApp carries the spoken caption in `image.caption`;
  it's already stored as `title`.
