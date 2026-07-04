import { bind, createState, createEffect, bindRepeater } from 'velo-hooks';
import { getLatestPhotos } from 'backend/gallery.web.js';

/**
 * Live gallery page.
 *
 * Reuses the velo-hooks reactive pattern from the parent project: hold the feed
 * in state, poll the backend on an interval, and let bindRepeater diff the
 * repeater so new photos slide in on their own — no manual DOM work.
 *
 * Page elements expected (rename to match your editor):
 *   #galleryRepeater   a Repeater
 *     └ #photo         an Image inside the repeater item
 *     └ #caption       a Text inside the repeater item
 *   #emptyState        (optional) Text/Box shown when there are no photos yet
 *   #statusText        (optional) Text showing last refresh / count
 *
 * If you would rather push than poll, swap the setInterval for a Wix Realtime
 * subscription (wix-realtime) triggered from saveIncomingPhoto — same state,
 * same bindRepeater, just a different feed source.
 */

const POLL_MS = 5000;

$w.onReady(() => {
    bind($w, (refs) => {
        const [photos, setPhotos] = createState([]);

        // poll the backend; cleanup clears the interval if the binding tears down
        createEffect(() => {
            let cancelled = false;

            const refresh = async () => {
                try {
                    const items = await getLatestPhotos(30);
                    if (!cancelled) setPhotos(items);
                } catch (e) {
                    console.error('live-frame gallery refresh failed', e);
                }
            };

            refresh();
            const timer = setInterval(refresh, POLL_MS);
            return () => {
                cancelled = true;
                clearInterval(timer);
            };
        });

        // empty-state + status text react to the feed automatically
        if (refs.emptyState) {
            refs.emptyState.hidden = () => photos().length > 0;
        }
        if (refs.statusText) {
            refs.statusText.text = () =>
                photos().length === 0
                    ? 'Waiting for your first photo… say "Hey Meta, send a photo to My Website"'
                    : `${photos().length} photo${photos().length === 1 ? '' : 's'} live`;
        }

        // the reactive gallery itself
        bindRepeater(refs.galleryRepeater, photos, (itemRefs, item) => {
            itemRefs.photo.src = () => item().image;
            if (itemRefs.caption) {
                itemRefs.caption.text = () => item().title || '';
            }
        });
    });
});
