import { test } from "node:test";
import { strict as assert } from "node:assert";
import { boardTopics, browseStories, storyDate } from "./board-browse";

const stories = [
  { id: "older", topics: ["Healing"], shared_at: "2026-11-01T12:00:00Z", created_at: "2026-10-01T12:00:00Z" },
  { id: "recent", topics: ["Safety", "Healing"], shared_at: "2026-11-08T12:00:00Z", created_at: "2026-09-01T12:00:00Z" },
  { id: "legacy", topics: ["Safety"], shared_at: null, created_at: "2026-11-04T12:00:00Z" },
];

test("posting date uses sharing date, falling back to creation for older records", () => {
  assert.equal(storyDate(stories[1]), "2026-11-08T12:00:00Z");
  assert.equal(storyDate(stories[2]), "2026-11-04T12:00:00Z");
});
test("most recent sorts by posting date rather than notebook creation or pinned pages", () => {
  assert.deepEqual(browseStories(stories, [], "newest").map((s) => s.id), ["recent", "legacy", "older"]);
  assert.deepEqual(browseStories(stories, [], "oldest").map((s) => s.id), ["older", "legacy", "recent"]);
  assert.equal(stories[0].id, "older");
});
test("topic filters match any selected interest and clearing restores all stories", () => {
  assert.deepEqual(browseStories(stories, ["Healing"], "newest").map((s) => s.id), ["recent", "older"]);
  assert.equal(browseStories(stories, ["Healing", "Safety"], "newest").length, 3);
  assert.equal(browseStories(stories, ["Unknown"], "newest").length, 0);
  assert.equal(browseStories(stories, [], "newest").length, 3);
  assert.ok(boardTopics(stories).includes("Healing"));
  assert.ok(boardTopics([]).includes("Financial abuse"));
  assert.equal(boardTopics(stories).filter((topic) => topic === "Safety").length, 1);
});