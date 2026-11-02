// Helpers that keep a reverse-geocoded street address honestly paired with the
// GPS reading that produced it. A phone's GPS wanders by a few metres between
// readings, so exact-coordinate matching would throw away a perfectly good
// address; instead an address stays valid while the reader is still inside the
// uncertainty radius of the fix it was looked up for.

export type Fix = { lat: number; lon: number; accuracy: number };

// GPS jitter floor: never treat a fix as tighter than this.
export const MIN_RADIUS_M = 25;

/** Great-circle distance in metres between two coordinates. */
export function distanceMeters(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Uncertainty radius that still makes an address from this fix trustworthy. */
export function radiusMeters(accuracy: number): number {
  return Math.max(accuracy, MIN_RADIUS_M);
}

/**
 * Can the address looked up for `fix` be shown/sent together with the reader's
 * current position? Only when the lookup is still the newest one and the
 * reader has not moved outside the fix's uncertainty radius.
 */
export function canApplyEmergencyAddress(
  current: Fix | null,
  fix: Fix,
  requestSequence: number,
  latestSequence: number,
): boolean {
  if (!current) return false;
  if (requestSequence !== latestSequence) return false;
  const radius = Math.max(radiusMeters(fix.accuracy), radiusMeters(current.accuracy));
  return distanceMeters(fix, current) <= radius;
}

/**
 * Should the address already on screen survive this newer GPS reading? Yes
 * while the reader is still inside the radius of the fix that produced it.
 */
export function shouldKeepEmergencyAddress(
  addressFix: Fix | null,
  next: Fix,
): boolean {
  if (!addressFix) return false;
  const radius = Math.max(radiusMeters(addressFix.accuracy), radiusMeters(next.accuracy));
  return distanceMeters(addressFix, next) <= radius;
}

/**
 * Is a fresh lookup worthwhile? Only when nothing has been geocoded yet, or
 * GPS got meaningfully tighter (25%+) than the fix that was used.
 */
export function shouldRegeocode(
  geocodedAccuracy: number | null,
  next: Fix,
): boolean {
  if (geocodedAccuracy === null || !Number.isFinite(geocodedAccuracy)) return true;
  return next.accuracy < geocodedAccuracy * 0.75;
}
