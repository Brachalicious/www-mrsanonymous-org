// A stalled connection must not leave a guide control waiting indefinitely.
// Never retry writes automatically: a timed-out save may already have landed.
export async function waitForGuidance<T>(request: Promise<T>, timeoutMs = 15000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      request,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("The connection is taking too long. Please reopen the conversation to check whether your changes were saved.")), timeoutMs);
      }),
    ]);
  } finally { if (timer !== undefined) clearTimeout(timer); }
}

export function guidanceIsWaiting(state: { listing: boolean; creating: boolean; loading: boolean; threadId?: string; error: unknown }): boolean {
  return !state.error && (state.listing || state.creating || (Boolean(state.threadId) && state.loading));
}