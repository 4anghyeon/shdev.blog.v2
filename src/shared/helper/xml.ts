const XML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

/** XML 텍스트와 속성 값에 들어갈 특수문자를 엔티티로 바꾼다. */
const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => XML_ENTITIES[char]);

export const xmlHelper = {
  escape: escapeXml,
} as const;
