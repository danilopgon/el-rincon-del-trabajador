// JSON-LD goes inside a <script> tag, so a "</script>" in any string would end it early.
// Escaping "<" as < keeps the JSON identical once parsed.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
