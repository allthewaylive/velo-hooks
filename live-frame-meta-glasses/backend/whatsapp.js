import { fetch } from 'wix-fetch';
import { getSecret } from 'wix-secrets-backend';

const GRAPH = 'https://graph.facebook.com/v20.0';

/**
 * Download a media object from the WhatsApp Cloud API by its media id.
 *
 * The webhook only gives us an id. Turning that into bytes is two calls:
 *   1. GET /{media-id}          -> a short-lived, authenticated download URL
 *   2. GET that url             -> the actual image bytes
 * Both require the Bearer access token.
 *
 * @param {string} mediaId
 * @returns {Promise<{ buffer: Buffer, mimeType: string }>}
 */
export async function downloadWhatsAppMedia(mediaId) {
    const token = await getSecret('WHATSAPP_ACCESS_TOKEN');
    const auth = { headers: { Authorization: `Bearer ${token}` } };

    // 1. resolve the media id to a download url
    const metaRes = await fetch(`${GRAPH}/${mediaId}`, auth);
    if (!metaRes.ok) {
        throw new Error(`media lookup failed: ${metaRes.status} ${await metaRes.text()}`);
    }
    const meta = await metaRes.json();

    // 2. download the bytes (same Bearer token required)
    const fileRes = await fetch(meta.url, auth);
    if (!fileRes.ok) {
        throw new Error(`media download failed: ${fileRes.status}`);
    }

    const arrayBuffer = await fileRes.arrayBuffer();
    return {
        buffer: Buffer.from(arrayBuffer),
        mimeType: meta.mime_type || 'image/jpeg'
    };
}
