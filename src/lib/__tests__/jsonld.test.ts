import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "../jsonld";

describe("serializeJsonLd", () => {
  const data = { headline: 'Botas </script><script>alert("x")</script> & más' };

  it("cannot close the script tag it is embedded in", () => {
    expect(serializeJsonLd(data)).not.toMatch(/<\/script/i);
    expect(serializeJsonLd(data)).not.toContain("<");
  });

  it("still parses back to the same data", () => {
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });
});
