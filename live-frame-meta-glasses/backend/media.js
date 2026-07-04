import { mediaManager } from 'wix-media-backend';
import wixData from 'wix-data';

const COLLECTION = 'LiveFramePhotos';
const FOLDER = '/live-frame-meta-glasses';

/**
 * Take a downloaded photo, push it into the Wix Media Manager, and record a row
 * in the LiveFramePhotos collection. That row is what the live gallery reads.
 *
 * @param {{ buffer: Buffer, mimeType: string, caption?: string,
 *           from?: string, whatsappMessageId?: string }} args
 */
export async function saveIncomingPhoto({ buffer, mimeType, caption = '', from = '', whatsappMessageId = '' }) {
    // Idempotency: WhatsApp can deliver the same message more than once.
    if (whatsappMessageId) {
        const dup = await wixData
            .query(COLLECTION)
            .eq('whatsappMessageId', whatsappMessageId)
            .limit(1)
            .find({ suppressAuth: true });
        if (dup.items.length > 0) {
            return dup.items[0];
        }
    }

    const ext = extForMime(mimeType);
    const fileName = `glasses-${nameStub(whatsappMessageId)}.${ext}`;

    // upload the raw buffer into the Media Manager
    const uploaded = await mediaManager.upload(FOLDER, buffer, fileName, {
        mediaOptions: { mimeType, mediaType: 'image' },
        metadataOptions: { isPrivate: false, isVisitorUpload: false }
    });

    // uploaded.fileUrl is the wix:image:// descriptor; get a servable URL too
    const row = await wixData.insert(
        COLLECTION,
        {
            title: caption || 'From Meta glasses',
            image: uploaded.fileUrl,
            source: 'meta-glasses',
            fromNumber: from,
            whatsappMessageId,
            receivedAt: nowIso()
        },
        { suppressAuth: true }
    );

    return row;
}

/**
 * Read the latest photos for the live gallery. Called from the page via a web
 * method (see gallery.web.js).
 */
export async function listLatestPhotos(limit = 30) {
    const res = await wixData
        .query(COLLECTION)
        .descending('receivedAt')
        .limit(limit)
        .find({ suppressAuth: true });

    return res.items.map((it) => ({
        _id: it._id,
        title: it.title,
        image: it.image,
        receivedAt: it.receivedAt
    }));
}

// --- small helpers ---------------------------------------------------------

function extForMime(mime) {
    if (mime.includes('png')) return 'png';
    if (mime.includes('webp')) return 'webp';
    if (mime.includes('heic')) return 'heic';
    return 'jpg';
}

// Avoid Date.now()/Math.random() collisions determinism concerns by leaning on
// the WhatsApp message id when present; fall back to an ISO timestamp.
function nameStub(whatsappMessageId) {
    if (whatsappMessageId) return whatsappMessageId.replace(/[^a-zA-Z0-9]/g, '').slice(-16);
    return new Date().toISOString().replace(/[^0-9]/g, '');
}

function nowIso() {
    return new Date().toISOString();
}
