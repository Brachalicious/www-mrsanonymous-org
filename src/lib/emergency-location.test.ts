import { test } from "node:test";
import { strict as assert } from "node:assert";
import { canApplyEmergencyAddress } from "./emergency-location";

test("a delayed address cannot attach to newer GPS coordinates even without a new lookup", () => {
  assert.equal(canApplyEmergencyAddress({ lat: 40.01, lon: -74 }, { lat: 40, lon: -74 }, 2, 2), false);
});

test("a superseded address lookup cannot overwrite the latest one", () => {
  assert.equal(canApplyEmergencyAddress({ lat: 40, lon: -74 }, { lat: 40, lon: -74 }, 2, 3), false);
});

test("refresh clears location and rejects outstanding addresses", () => {
  assert.equal(canApplyEmergencyAddress(null, { lat: 40, lon: -74 }, 2, 2), false);
});

test("the current lookup can apply to its exact GPS fix", () => {
  assert.equal(canApplyEmergencyAddress({ lat: 40, lon: -74 }, { lat: 40, lon: -74 }, 2, 2), true);
});