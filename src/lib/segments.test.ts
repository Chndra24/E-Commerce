import { describe, expect, it } from "vitest";

import { SEGMENT_KEYS, SEGMENT_META, isSegmentKey, segmentColor, segmentLabel } from "./segments";

describe("SEGMENT_KEYS", () => {
  it("berisi 11 segmen sesuai PRD §10.2", () => {
    expect(SEGMENT_KEYS).toHaveLength(11);
  });

  it("mengikuti urutan prioritas aturan", () => {
    expect(SEGMENT_KEYS).toEqual([
      "CHAMPIONS",
      "CANNOT_LOSE_THEM",
      "LOYAL",
      "AT_RISK",
      "POTENTIAL_LOYALIST",
      "NEW",
      "PROMISING",
      "NEED_ATTENTION",
      "ABOUT_TO_SLEEP",
      "HIBERNATING",
      "LOST",
    ]);
  });

  it("memakai warna unik agar legenda chart tidak ambigu", () => {
    const colors = SEGMENT_KEYS.map((key) => SEGMENT_META[key].color);

    expect(new Set(colors).size).toBe(colors.length);
    expect(colors.every((color) => /^#[0-9a-f]{6}$/i.test(color))).toBe(true);
  });

  it("memberi label dan deskripsi untuk setiap segmen", () => {
    for (const key of SEGMENT_KEYS) {
      expect(SEGMENT_META[key].label.length).toBeGreaterThan(0);
      expect(SEGMENT_META[key].description.length).toBeGreaterThan(0);
    }
  });
});

describe("helper segmen", () => {
  it("mengenali kunci segmen yang valid", () => {
    expect(isSegmentKey("CHAMPIONS")).toBe(true);
    expect(isSegmentKey("champions")).toBe(false);
    expect(isSegmentKey("UNKNOWN")).toBe(false);
  });

  it("mengembalikan label dan warna", () => {
    expect(segmentLabel("AT_RISK")).toBe("Berisiko");
    expect(segmentColor("AT_RISK")).toBe("#dc2626");
  });
});
