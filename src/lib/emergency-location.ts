export function canApplyEmergencyAddress(
  current: { lat: number; lon: number } | null,
  fix: { lat: number; lon: number },
  requestSequence: number,
  latestSequence: number,
): boolean {
  return current !== null && requestSequence === latestSequence &&
    current.lat === fix.lat && current.lon === fix.lon;
}