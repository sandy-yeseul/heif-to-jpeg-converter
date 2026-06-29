import { describe, it, expect } from "vitest";
import { formatSize, isHeifFile } from "../utils";

describe("formatSize", () => {
  it("formats bytes under 1 MB as KB", () => {
    expect(formatSize(512 * 1024)).toBe("512 KB");
  });

  it("formats bytes at exactly 1 MB", () => {
    expect(formatSize(1_048_576)).toBe("1.0 MB");
  });

  it("formats large files in MB", () => {
    expect(formatSize(3.8 * 1_048_576)).toBe("3.8 MB");
  });

  it("formats small files in KB", () => {
    expect(formatSize(1024)).toBe("1 KB");
  });
});

describe("isHeifFile", () => {
  const makeFile = (name: string) => new File([], name);

  it("accepts .heic", () => expect(isHeifFile(makeFile("photo.heic"))).toBe(true));
  it("accepts .HEIC (uppercase)", () => expect(isHeifFile(makeFile("photo.HEIC"))).toBe(true));
  it("accepts .heif", () => expect(isHeifFile(makeFile("photo.heif"))).toBe(true));
  it("accepts .hif", () => expect(isHeifFile(makeFile("photo.hif"))).toBe(true));

  it("rejects .jpg", () => expect(isHeifFile(makeFile("photo.jpg"))).toBe(false));
  it("rejects .png", () => expect(isHeifFile(makeFile("photo.png"))).toBe(false));
  it("rejects .jpeg", () => expect(isHeifFile(makeFile("photo.jpeg"))).toBe(false));
  it("rejects files with no extension", () => expect(isHeifFile(makeFile("photo"))).toBe(false));
});
