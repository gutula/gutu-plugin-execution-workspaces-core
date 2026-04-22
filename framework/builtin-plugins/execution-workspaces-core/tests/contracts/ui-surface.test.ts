import { describe, expect, it } from "bun:test";

import { uiSurface } from "../../src/ui/surfaces";

describe("execution ui surface", () => {
  it("mounts the execution workspace page", () => {
    expect(uiSurface.embeddedPages[0]?.route).toBe("/admin/execution");
  });
});
