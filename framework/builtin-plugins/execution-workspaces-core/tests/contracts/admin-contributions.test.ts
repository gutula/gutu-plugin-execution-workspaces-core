import { describe, expect, it } from "bun:test";

import { adminContributions } from "../../src/ui/admin.contributions";

describe("execution admin contributions", () => {
  it("registers the execution control room", () => {
    expect(adminContributions.workspaces[0]?.id).toBe("execution");
    expect(adminContributions.pages[0]?.route).toBe("/admin/execution");
  });
});
