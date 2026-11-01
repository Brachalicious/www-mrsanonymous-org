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

  test("a bare greeting gets the hello answer", () => {
    assert.match(answerGuidanceQuestion("hi there"), /Hello, how can I help\?/);
  });

  test("a question that merely contains the word this is not treated as a greeting", () => {
    const answer = answerGuidanceQuestion("is this my notebook private");
    assert.doesNotMatch(answer, /Hello, how can I help\?/);
    assert.match(answer, /private/i);
  });

  test("specific incident questions select incident guidance, not board moderation", () => {
    assert.equal(matchGuidanceTopic("how do I make an incident report")?.id, "incident_reports");
  });

  test("specific recording questions select body cam guidance", () => {
    assert.equal(matchGuidanceTopic("how do I start recording with body cam")?.id, "body_cam");
  });

  test("location troubleshooting is not mistaken for general GPS guidance", () => {
    assert.equal(matchGuidanceTopic("my location is wrong address not found")?.id, "location_permission");
  });

  test("saving an address selects address management", () => {
    assert.equal(matchGuidanceTopic("how do I save my address")?.id, "saved_addresses");
  });

  test("unrelated questions mentioning app do not match installation", () => {
    assert.equal(matchGuidanceTopic("can the app predict tomorrow's weather"), null);
  });

  test("deleting a conversation selects chat management, not account deletion", () => {
    assert.equal(matchGuidanceTopic("how do I delete conversation history")?.id, "guidance_threads");
  });

  test("a body cam app question is not swallowed by generic install terms", () => {
    assert.equal(matchGuidanceTopic("where is the body cam in this app")?.id, "body_cam");
  });
});
