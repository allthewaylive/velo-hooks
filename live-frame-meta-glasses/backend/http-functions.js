import { ok, badRequest, forbidden, response } from 'wix-http-functions';
import { getSecret } from 'wix-secrets-backend';
import { downloadWhatsAppMedia } from 'backend/whatsapp.js';
import { saveIncomingPhoto } from 'backend/media.js';

/**
 * WhatsApp Cloud API webhook.
 *
 * Exposed by Wix at:  https://<your-site>/_functions/whatsapp
 * (in preview/dev it is /_functions-dev/whatsapp)
 *
 * Two jobs:
 *  - GET  : one-time verification handshake when you register the webhook
 *  - POST : receive inbound messages; when one carries an image, download it
 *           and push it onto the site.
 */

// ---- GET: webhook verification -------------------------------------------
// WhatsApp calls this once with hub.mode / hub.verify_token / hub.challenge.
// Echo the challenge back IF the token matches our stored secret.
export async function get_whatsapp(request) {
    const mode = request.query['hub.mode'];
    const token = request.query['hub.verify_token'];
    const challenge = request.query['hub.challenge'];

    const expected = await getSecret('WHATSAPP_VERIFY_TOKEN');

    if (mode === 'subscribe' && token === expected) {
        // Must return the raw challenge as plain text, 200.
        return response({ status: 200, body: challenge, headers: { 'Content-Type': 'text/plain' } });
    }
    return forbidden({ body: 'verification failed' });
}

// ---- POST: inbound messages ----------------------------------------------
export async function post_whatsapp(request) {
    let payload;
    try {
        payload = await request.body.json();
    } catch (e) {
        return badRequest({ body: 'invalid json' });
    }

    // Acknowledge fast. WhatsApp retries if we are slow or non-200, so we do the
    // heavy work but still return 200 on anything we could parse.
    try {
        const messages = extractMessages(payload);
        for (const msg of messages) {
            if (msg.type === 'image' && msg.image && msg.image.id) {
                const media = await downloadWhatsAppMedia(msg.image.id);
                await saveIncomingPhoto({
                    buffer: media.buffer,
                    mimeType: media.mimeType,
                    caption: msg.image.caption || '',
                    from: msg.from || 'unknown',
                    whatsappMessageId: msg.id
                });
            }
        }
    } catch (err) {
        // Log but still 200 so WhatsApp does not hammer us with retries.
        console.error('live-frame webhook error', err);
    }

    return ok({ body: 'EVENT_RECEIVED' });
}

/**
 * Dig the message array out of the WhatsApp webhook envelope.
 * Shape: { entry: [ { changes: [ { value: { messages: [...] } } ] } ] }
 */
function extractMessages(payload) {
    const out = [];
    const entries = payload && payload.entry ? payload.entry : [];
    for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
            const msgs = change.value && change.value.messages ? change.value.messages : [];
            out.push(...msgs);
        }
    }
    return out;
}
