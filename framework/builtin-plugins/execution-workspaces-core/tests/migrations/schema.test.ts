import { describe, expect, it } from "bun:test";
import { getTableColumns } from "drizzle-orm";

import { executionRuntimeServices, executionWorkspaces } from "../../db/schema";

describe("execution schema coverage", () => {
  it("captures workspaces and runtime services", () => {
    expect(Object.keys(getTableColumns(executionWorkspaces))).toEqual([
      "id",
      "tenantId",
      "label",
      "status",
      "ownerAgentProfileId",
      "repoRef",
      "previewUrl",
      "policyProfile",
      "isolationMode",
      "environmentScope",
      "updatedAt"
    ]);
    expect(Object.keys(getTableColumns(executionRuntimeServices))).toEqual([
      "id",
      "tenantId",
      "workspaceId",
      "label",
      "kind",
      "status",
      "endpoint",
      "lastTransitionAt"
    ]);
  });
});
