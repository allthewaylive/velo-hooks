import { Permissions, webMethod } from 'wix-web-module';
import { listLatestPhotos } from 'backend/media.js';

/**
 * Web method the live gallery page calls to fetch the current feed.
 * Public read is fine for a demo wall; tighten Permissions if the photos
 * should be restricted.
 */
export const getLatestPhotos = webMethod(Permissions.Anyone, async (limit = 30) => {
    return listLatestPhotos(limit);
});
