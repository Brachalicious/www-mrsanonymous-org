import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { answerGuidanceQuestion, GUIDANCE_TOPICS, matchGuidanceTopic } from "./knowledge";

describe("built-in guidance answers", () => {
  test("safety plan question names the safety plan page and its export options", () => {
    const answer = answerGuidanceQuestion("where is my safety plan and can I download it");
    assert.match(answer, /My Safety Plan/);
    assert.match(answer, /PDF/);
    assert.doesNotMatch(answer, /AI gateway|credits/);
  });

  test("saved notes question points at the private journal and the save button", () => {
    const answer = answerGuidanceQuestion("where are my saved abuse notes and recordings");
    assert.match(answer, /private journal/i);
    assert.match(answer, /Save button/);
  });

  test("911 question mentions the written address at the top of the text", () => {
    const answer = answerGuidanceQuestion("how do i text 911");
    assert.match(answer, /Text 911/);
    assert.match(answer, /written street address|written address/);
  });

  test("immediate danger is answered with emergency lines before anything else", () => {
    const answer = answerGuidanceQuestion("hes coming and im trapped");
    assert.match(answer, /Call 911/);
    assert.match(answer, /866-488-7386/);
    assert.match(answer, /988/);
    assert.match(answer, /Quick Exit/);
  });

  test("quick exit question explains ESC and the no-back behaviour", () => {
    const answer = answerGuidanceQuestion("how do i leave this site fast");
    assert.match(answer, /ESC/);
    assert.match(answer, /back button/);
  });

  test("calculator question explains the chosen calculation as the passcode", () => {
    const answer = answerGuidanceQuestion("how does the calculator disguise unlock");
    assert.match(answer, /calculation/);
    assert.match(answer, /passcode/);
  });

  test("an unrelated question gets the fallback and never invents an answer", () => {
    const answer = answerGuidanceQuestion("what is the capital of france");
    assert.match(answer, /I can only answer questions about using MrsANONymous/);
    assert.doesNotMatch(answer, /Paris/);
  });

  test("empty input gets the fallback instead of a crash", () => {
    assert.equal(answerGuidanceQuestion("   "), matchGuidanceTopic("") ? "unexpected" : answerGuidanceQuestion(""));
    assert.match(answerGuidanceQuestion(""), /Contact page|danger/);
  });

  test("every topic has keywords and a non-empty answer", () => {
    for (const topic of GUIDANCE_TOPICS) {
      assert.ok(topic.keywords.length > 0, `${topic.id} has no keywords`);
      assert.ok(topic.answer.trim().length > 20, `${topic.id} answer is too short`);
    }
  });

  test("pinned page question does not claim to move other people's posts", () => {
    const answer = answerGuidanceQuestion("how do i pin my pages to the top");
    assert.match(answer, /pin/i);
    assert.match(answer, /does not move anyone else/);
  });
});
