import { describe, expect, it } from "vitest";

import {
  formatCurrency,
  formatDateWib,
  formatDateTimeWib,
  formatNumber,
  formatPercent,
  toFiniteNumber,
} from "./format";

const normalize = (value: string) => value.replace(/\u00a0/g, " ");

describe("formatCurrency", () => {
  it("memakai awalan Rp tanpa spasi dan pemisah ribuan titik", () => {
    expect(formatCurrency(1234567)).toBe("Rp1.234.567");
  });

  it("menangani nol dan nilai negatif", () => {
    expect(formatCurrency(0)).toBe("Rp0");
    expect(formatCurrency(-1500)).toBe("-Rp1.500");
  });

  it("menerima string dan objek mirip Prisma Decimal", () => {
    expect(formatCurrency("25000")).toBe("Rp25.000");
    expect(formatCurrency({ toString: () => "1500000.00" })).toBe("Rp1.500.000");
  });

  it("membulatkan pecahan rupiah", () => {
    expect(formatCurrency(1234.6)).toBe("Rp1.235");
  });
});

describe("formatNumber", () => {
  it("memakai pemisah ribuan id-ID", () => {
    expect(formatNumber(1234567)).toBe("1.234.567");
  });
});

describe("formatPercent", () => {
  it("menerima rasio dan menampilkan satu desimal", () => {
    expect(normalize(formatPercent(0.1234))).toBe("12,3%");
    expect(normalize(formatPercent(0))).toBe("0,0%");
    expect(normalize(formatPercent(1))).toBe("100,0%");
  });
});

describe("formatDateWib", () => {
  it("menggeser tanggal ke hari berikutnya saat UTC masih hari sebelumnya", () => {
    expect(formatDateWib("2026-11-16T17:30:00.000Z")).toBe("17 November 2026");
  });

  it("tidak menggeser tanggal di tengah hari", () => {
    expect(formatDateWib("2026-11-16T05:00:00.000Z")).toBe("16 November 2026");
  });
});

describe("formatDateTimeWib", () => {
  it("menampilkan jam WIB, bukan jam mesin", () => {
    const formatted = normalize(formatDateTimeWib("2026-11-16T17:05:00.000Z"));

    expect(formatted).toContain("17 Nov 2026");
    expect(formatted).toContain("00.05");
  });
});

describe("toFiniteNumber", () => {
  it("menolak nilai yang bukan angka", () => {
    expect(() => toFiniteNumber("bukan-angka")).toThrow(TypeError);
    expect(() => toFiniteNumber(Number.POSITIVE_INFINITY)).toThrow(TypeError);
  });
});

describe("format tanggal tidak valid", () => {
  it("melempar TypeError", () => {
    expect(() => formatDateWib("bukan-tanggal")).toThrow(TypeError);
  });
});
