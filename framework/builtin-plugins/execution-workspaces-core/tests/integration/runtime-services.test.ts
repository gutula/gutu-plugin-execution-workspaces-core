import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { realizeExecutionWorkspace, startRuntimeService } from "../../src/services/main.service";

describe("execution runtime services", () => {
  let stateDir = "";
  const previousStateDir = process.env.GUTU_STATE_DIR;

  beforeEach(() => {
    stateDir = mkdtempSync(join(tmpdir(), "gutu-execution-integration-"));
    process.env.GUTU_STATE_DIR = stateDir;
  });

  afterEach(() => {
    rmSync(stateDir, { recursive: true, force: true });
    if (previousStateDir === undefined) {
      delete process.env.GUTU_STATE_DIR;
      return;
    }
    process.env.GUTU_STATE_DIR = previousStateDir;
  });

  it("realizes a workspace and starts its preview runtime", () => {
    realizeExecutionWorkspace({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      workspaceId: "workspace:customer-preview",
      label: "Customer Preview",
      policyProfile: "policy.workspace.standard",
      isolationMode: "worker",
      environmentScope: "dev",
      previewUrl: "https://preview.example.com/customer"
    });

    const started = startRuntimeService({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      workspaceId: "workspace:customer-preview",
      serviceId: "runtime-service:workspace:customer-preview:preview"
    });

    expect(started.status).toBe("running");
  });
});
