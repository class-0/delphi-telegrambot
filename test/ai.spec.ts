import { before, describe, it } from "mocha";
import { OPENAI_ERROR, fetchUrlSummary } from "../bots/ai.js";
import { expect } from "chai";

describe("Fetching URL Summary", () => {
  let openaiKey = process.env.OPENAI_API_KEY ?? "";

  it("Failed to call without API KEY", async () => {
    try {
      await fetchUrlSummary("https://vercel.com", "");
    } catch (err) {
      expect(err.message).to.be.eql(OPENAI_ERROR);
    }
  });

  it("Fetch the invalid url summary", async () => {
    try {
      const summary = await fetchUrlSummary("asdf", openaiKey);
      expect(summary).to.not.be("");
    } catch (err) {
      console.log(err);
    }
  });
});
