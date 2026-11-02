import { test } from "node:test";
import { strict as assert } from "node:assert";
import {
  canApplyEmergencyAddress,
  distanceMeters,
  shouldKeepEmergencyAddress,
  shouldRegeocode,
  type Fix,
} from "./emergency-location";

const COARSE: Fix = { lat: 40, lon: -74, accuracy: 40 };

test("distanceMeters measures a known gap", () => {
  // 0.01 degrees of latitude is about 1.1 km.
  const d = distanceMeters({ lat: 40, lon: -74 }, { lat: 40.01, lon: -74 });
  assert.ok(d > 1000 && d < 1200, `expected ~1112m, got ${d}`);
});

test("a delayed address cannot attach to coordinates a kilometre away", () => {
  assert.equal(
    canApplyEmergencyAddress({ lat: 40.01, lon: -74, accuracy: 10 }, COARSE, 2, 2),
    false,
  );
});

test("a superseded address lookup cannot overwrite the latest one", () => {
  assert.equal(
    canApplyEmergencyAddress({ lat: 40, lon: -74, accuracy: 40 }, COARSE, 2, 3),
    false,
  );
});

test("refresh clears location and rejects outstanding addresses", () => {
  assert.equal(canApplyEmergencyAddress(null, COARSE, 2, 2), false);
});

test("the current lookup applies to its own GPS fix", () => {
  assert.equal(
    canApplyEmergencyAddress({ lat: 40, lon: -74, accuracy: 40 }, COARSE, 2, 2),
    true,
  );
});

test("an address still applies after a slightly better fix nearby", () => {
  // A ±40m fix sharpened to ±30m a few metres away is the same place.
  const sharper: Fix = { lat: 40.0001, lon: -74, accuracy: 30 };
  assert.equal(canApplyEmergencyAddress(sharper, COARSE, 2, 2), true);
});

test("a better fix keeps the address it was already shown", () => {
  assert.equal(shouldKeepEmergencyAddress(COARSE, { lat: 40.0001, lon: -74, accuracy: 30 }), true);
});

test("moving to a different place drops the old address", () => {
  assert.equal(
    shouldKeepEmergencyAddress(COARSE, { lat: 40.01, lon: -74, accuracy: 20 }),
    false,
  );
});

test("no address means nothing to keep", () => {
  assert.equal(shouldKeepEmergencyAddress(null, COARSE), false);
});

test("a small accuracy gain does not trigger a new lookup", () => {
  assert.equal(shouldRegeocode(40, { lat: 40, lon: -74, accuracy: 35 }), false);
});

test("the first fix always gets looked up", () => {
  assert.equal(shouldRegeocode(null, COARSE), true);
});

test("a much tighter fix is worth looking up again", () => {
  assert.equal(shouldRegeocode(100, { lat: 40, lon: -74, accuracy: 60 }), true);
});
